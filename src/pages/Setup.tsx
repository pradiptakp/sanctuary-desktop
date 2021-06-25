/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../components/Card';
import { RootState } from '../redux/store';
import { getDashboardInfo } from '../redux/actions/appActions';
import { DashboardData, Device } from '../types';
import ClipLoader from 'react-spinners/ClipLoader';
import { Link, useHistory } from 'react-router-dom';
import { getDevices } from '../redux/actions/deviceActions';
import Swal from 'sweetalert2';
import Button from '../components/Button';
import Input from '../components/Input';
//@ts-ignore
import arduinoCli from 'arduino-cli';
import path from 'path';
import fs from 'fs';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const cliPath = path.join(
  path.dirname(__dirname),
  'extraResources',
  'arduino-cli.exe'
);
const sketchesPath = path.dirname(__dirname) + '/~/arduino-cli/sketches/';

const cli = arduinoCli(cliPath, {
  directories: {
    user: '~/arduino-cli/sketches',
    data: '~/arduino-cli/data',
  },
});

const generateSketch = ({
  devices,
  ssid,
  pass,
  host,
}: {
  devices: { device: Device; pin: string }[];
  ssid: string;
  pass: string;
  host: string;
}) => {
  return `
#include <ESP8266WiFi.h> \n
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>

#define DHTTYPE    DHT11

const char *ssid =  "${ssid}";
const char *pass =  "${pass}";

String host = "${host}";
${devices
  .map(
    (v) => `
int PIN_${v.pin} = ${v.pin};
String ID_${v.pin} = "${v.device.id}";
${
  v.device.type === 'Temperature'
    ? `
DHT dht(PIN_${v.pin}, DHTTYPE);
`
    : ``
}
`
  )
  .join('')}
float temp = 0.0;

WiFiClient client;

void setup()
{
       Serial.begin(9600);
       delay(10);

       ${devices
         .map(
           (v) =>
             `${
               v.device.type === 'Lamp' || v.device.type === 'Lock'
                 ? `
        pinMode(PIN_${v.pin}, OUTPUT);`
                 : `
        dht.begin();`
             }`
         )
         .join('')}
       Serial.println("Connecting to ");
       Serial.println(ssid);
       WiFi.mode(WIFI_STA);
       WiFi.begin(ssid, pass);
       while (WiFi.status() != WL_CONNECTED)
          {
            delay(500);
            Serial.print(".");
          }

       Serial.println("");
       Serial.println("WiFi connected");
}

void loop()
{
  if(WiFi.status()== WL_CONNECTED){
      ${devices
        .map(
          (v, i) => `
      ${
        v.device.type === 'Temperature'
          ? `
      HTTPClient http${i};
      String url${i} = host + "/api/device/update-temperature/" + "${v.device.id}";

      float newTemp = dht.readTemperature();

      if (isnan(newTemp)) {
        Serial.println("Failed to read from DHT sensor!");
      }

      http${i}.begin(url${i}.c_str());
      http${i}.addHeader("Content-Type", "text/plain");

      if (temp != newTemp) {
        temp = newTemp;
        Serial.println(temp);

        int httpResponseCode${i} = http${i}.POST(String(newTemp, 1));

        if (httpResponseCode${i}>0) {
          Serial.print("HTTP Response code: ");
          Serial.println(httpResponseCode${i});
        }
        else {
          Serial.print("Error code: ");
          Serial.println(httpResponseCode${i});
        }

      http${i}.end();
      }
      `
          : `

      HTTPClient http${i};

      String url${i} = host + "/api/device-from-mc/" + "${v.device.id}" + "?options=keyValues";

      http${i}.begin(url${i}.c_str());
      http${i}.addHeader("fiware-service", "openiot");
      http${i}.addHeader("fiware-servicepath", "/");
      int httpResponseCode${i} = http${i}.GET();

      if (httpResponseCode${i}>0) {
        String payload = http${i}.getString();
        DynamicJsonDocument jsonResponse(1024);
        deserializeJson(jsonResponse, payload);

        const char* state = jsonResponse["state"];
        const char* offState = "off";
        const char* onState = "on";

        if(strcmp(state, offState) == 0) {
          digitalWrite(${v.pin}, HIGH);
        } else if (strcmp(state, onState) == 0) {
          digitalWrite(${v.pin}, LOW);
        }
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode${i});
      }

      http${i}.end();
      `
      }
      `
        )
        .join('')}
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    delay(1000);
}

`;
};

const Setup = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state: RootState) => state.auth.user);
  const hostname = useSelector((state: RootState) => state.app.hostUrl);
  const [step, setStep] = React.useState<1 | 2 | 3>(1);

  const [loading, setLoading] = React.useState(true);
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [ssid, setSsid] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [selectedDevices, setSelectedDevices] = React.useState<
    { device: Device; pin: string }[]
  >([]);

  const [isInstallingBoard, setIsInstallingBoard] = React.useState(true);
  const [isCheckingPort, setIsCheckingPort] = React.useState(true);
  const [isInstallingLibrary, setIsInstallingLibrary] = React.useState(true);
  const [isCompiling, setIsCompiling] = React.useState(true);
  const [isUploading, setIsUploading] = React.useState(true);
  const [portOutput, setPortOutput] = React.useState('');

  const [port, setPort] = React.useState('');
  const [compileOutput, setCompileOutput] = React.useState<string>('');

  React.useEffect(() => {
    cli.listConnectedBoards().then((res: any) => console.log(res));
    dispatch(
      getDevices.request({
        onSuccess: (res) => {
          setDevices(res);
          setLoading(false);
        },
        onFailure: () => {
          setLoading(false);
        },
      })
    );
  }, []);

  React.useEffect(() => {
    if (step === 1) {
      setIsInstallingBoard(true);
      setIsInstallingLibrary(true);
      setIsCompiling(true);
      setIsUploading(true);
      setCompileOutput('');
    }
    if (step === 2) {
      checkPorts();

      cli.core
        .install((res: string) => {
          console.log(res);
        }, 'esp8266:esp8266')
        .then(() => {
          setIsInstallingBoard(false);
          installLibraries().then(() => {
            fs.writeFile(
              path.dirname(__dirname) + `/~/arduino-cli/sketches/sketches.ino`,
              generateSketch({
                devices: selectedDevices,
                host: hostname,
                pass: pass,
                ssid: ssid,
              }),
              function (err) {
                if (err) return console.log(err);
              }
            );
          });
        });
    }
    if (step === 3) {
      cli
        .compile(
          (res: string) => {
            console.log(res);
            setCompileOutput(compileOutput + '\n' + res);
          },
          'esp8266:esp8266:nodemcu',
          'sketches'
        )
        .then(() => {
          cli
            .upload(
              (res: string) => {
                console.log(res);
                setCompileOutput(compileOutput + '\n' + res);
              },
              port,
              'esp8266:esp8266:nodemcu',
              'sketches'
            )
            .then(() => {
              Swal.fire(
                'Success',
                'Sketch compiled and uploaded to the board',
                'success'
              ).then(() => {
                history.replace('/dashboard');
              });
            });
        });
    }
  }, [step]);

  const onSelect = async (device: Device) => {
    if (selectedDevices.find((v) => v.device.id === device.id)) {
      setSelectedDevices(
        selectedDevices.filter((v) => v.device.id !== device.id)
      );
    } else {
      const { value, isConfirmed } = await Swal.fire({
        title: 'Select Device',
        text: `What GPIO is device ${device.id}? (Search your microcontroller model if you're not sure)`,
        input: 'text',
        inputPlaceholder: 'eg: If GPIO5 just write 5',
        showCancelButton: true,
      });
      if (value && isConfirmed) {
        setSelectedDevices([
          ...selectedDevices,
          { device: device, pin: value },
        ]);
      }
    }
  };

  const installLibraries = async () => {
    try {
      const { stdout, stderr } = await exec(
        cliPath + ' lib install ArduinoJson@6.17.2 "DHT sensor library"@1.4.1'
      );
      console.log(stdout);
      if (!stderr) {
        setIsInstallingLibrary(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkPorts = async () => {
    try {
      const { stdout, stderr } = await exec(cliPath + ' board list');
      if (!stderr) {
        setIsInstallingLibrary(false);
      }

      setPortOutput(stdout);
      setIsCheckingPort(false);

      return stdout;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="h-40 flex justify-center items-center">
          <ClipLoader size={40} color={'#123abc'} />
        </div>
      ) : (
        <Card className="bg-white ">
          <div className="mx-4 p-4">
            <div className="flex items-center">
              <div className="flex items-center relative">
                <div
                  className={`rounded-full transition duration-500 ease-in-out h-4 w-4  border-2 border-blue-600 ${
                    step === 1 ? 'bg-blue-600' : ''
                  }`}
                ></div>
                <div
                  className={`absolute top-0 -ml-14 text-center mt-6 w-32 text-xs font-medium uppercase ${
                    step >= 1 ? 'text-blue-600' : 'text-gray-600'
                  } `}
                >
                  Sketch Setup
                </div>
              </div>
              {step >= 2 ? (
                <div className="flex-1 border-t-2 transition duration-500 ease-in-out border-blue-600"></div>
              ) : (
                <div className="flex-1 border-t-2 transition duration-500 ease-in-out border-gray-300"></div>
              )}

              <div className="flex items-center relative">
                <div
                  className={`rounded-full transition duration-500 ease-in-out h-4 w-4  border-2 border-blue-600 ${
                    step === 2 ? 'bg-blue-600' : ''
                  }`}
                ></div>
                <div
                  className={`absolute top-0 -ml-14 text-center mt-6 w-32 text-xs font-medium uppercase ${
                    step >= 2 ? 'text-blue-600' : 'text-gray-600'
                  } `}
                >
                  Arduino Setup
                </div>
              </div>
              {step >= 3 ? (
                <div className="flex-1 border-t-2 transition duration-500 ease-in-out border-blue-600"></div>
              ) : (
                <div className="flex-1 border-t-2 transition duration-500 ease-in-out border-gray-300"></div>
              )}
              <div className="flex items-center relative">
                <div
                  className={`rounded-full transition duration-500 ease-in-out h-4 w-4  border-2 border-blue-600 ${
                    step === 3 ? 'bg-blue-600' : ''
                  }`}
                ></div>
                <div
                  className={`absolute top-0 -ml-14 text-center mt-6 w-32 text-xs font-medium uppercase ${
                    step >= 3 ? 'text-blue-600' : 'text-gray-600'
                  } `}
                >
                  Compile
                </div>
              </div>
            </div>
          </div>
          {step === 1 ? (
            <>
              <div className="flex space-x-4 mt-16">
                <div>
                  WIFI Name / SSID
                  <Input
                    type="text"
                    placeholder="WIFI Name"
                    value={ssid}
                    onChange={(e) => setSsid(e.target.value)}
                  />
                </div>
                <div>
                  WIFI Password
                  <Input
                    type="text"
                    placeholder="WIFI Password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                  />
                </div>
                <div className="flex-1" />
                <div>
                  <Button
                    onClick={() => {
                      setStep(2);
                    }}
                    className="ml-6"
                    disabled={
                      loading || !pass || !ssid || selectedDevices.length === 0
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
              <div className="w-full h-px bg-blueGray-200 my-8" />
              <div className="flex items-start space-x-10">
                <div className=" flex flex-col justify-center w-64">
                  <div className="font-bold mb-4">
                    Devices{' '}
                    <span className="font-normal text-blueGray-400">
                      (Click to select)
                    </span>
                  </div>
                  {devices.map((v) => {
                    return (
                      <div
                        onClick={() => onSelect(v)}
                        className={`p-4 mb-4 rounded-md hover:bg-blue-100 transition cursor-pointer ${
                          selectedDevices.find((_v) => _v.device.id === v.id)
                            ? 'bg-blue-100 ring-2 ring-blue-600'
                            : 'bg-blueGray-100'
                        }`}
                      >
                        <div className="text-xs font-medium text-blueGray-400 ">
                          Device{' '}
                        </div>
                        <div>{v.id.replace('urn:ngsi-ld:', '')}</div>
                        <div className="text-xs font-medium text-blueGray-400 mt-2">
                          Room
                        </div>
                        <div>{v.refRoom}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex-1">
                  <div className="font-bold mb-4">Sketch Preview</div>
                  <pre className="text-xs bg-blueGray-100 p-4 rounded-md">
                    {generateSketch({
                      devices: selectedDevices,
                      host: hostname,
                      pass: pass,
                      ssid: ssid,
                    })}
                  </pre>
                </div>
              </div>
            </>
          ) : step === 2 ? (
            <>
              <div className="flex space-x-4 mt-16">
                <Button
                  onClick={() => {
                    setStep(1);
                  }}
                  className="ml-6"
                >
                  Previous
                </Button>
                <div className="flex-1" />
                <Button
                  onClick={() => {
                    setStep(3);
                  }}
                  className="ml-6"
                  disabled={
                    isInstallingBoard ||
                    isInstallingLibrary ||
                    isCheckingPort ||
                    !port
                  }
                >
                  Next
                </Button>
              </div>
              <div className="w-full h-px bg-blueGray-200 my-8" />
              <div className="flex items-start space-x-10">
                <div className="flex-1">
                  <div className="font-bold mb-4 text-lg">Arduino Setup</div>
                  {isInstallingBoard ? (
                    <div className="flex items-center ">
                      <ClipLoader size={16} color={'#123abc'} />

                      <div className="ml-2">
                        Installing Board Package (NodeMCU ESP8266)
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center ">
                      <div className="text-bold text-green-600">✓</div>
                      <div className="ml-2">
                        Board Package (NodeMCU ESP8266) Installed
                      </div>
                    </div>
                  )}

                  {isInstallingLibrary ? (
                    <div className="flex items-center ">
                      <ClipLoader size={16} color={'#123abc'} />

                      <div className="ml-2">Installing Library</div>
                    </div>
                  ) : (
                    <div className="flex items-center ">
                      <div className="text-bold text-green-600">✓</div>
                      <div className="ml-2">Library Installed</div>
                    </div>
                  )}

                  {isCheckingPort ? (
                    <div className="flex items-center ">
                      <ClipLoader size={16} color={'#123abc'} />

                      <div className="ml-2">
                        Checking Ports, make sure you already connect the board
                        to USB Port
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center ">
                        <div className="text-bold text-green-600">✓</div>
                        <div className="ml-2">Finished checking ports</div>
                      </div>
                      <pre className="text-xs bg-blueGray-100 p-4 rounded-md mt-4">
                        {portOutput}
                      </pre>
                    </>
                  )}

                  <Button
                    onClick={() => {
                      setIsCheckingPort(true);
                      setPortOutput('');
                      checkPorts();
                    }}
                    className="mt-4 mb-8"
                    disabled={isCheckingPort}
                  >
                    Recheck Port
                  </Button>

                  <div className="max-w-lg">
                    Input the port you want to use (e.g., COM3 or
                    /dev/tty.usbmodem1411)
                    <Input
                      type="text"
                      placeholder="Port"
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex space-x-4 mt-16">
                <Button
                  onClick={() => {
                    setStep(1);
                  }}
                  className="ml-6"
                >
                  Cancel
                </Button>
              </div>
              <div className="w-full h-px bg-blueGray-200 my-8" />
              <div className="flex items-start space-x-10">
                <div className="flex-1">
                  <div className="font-bold mb-4">Compile</div>
                  {isCompiling ? (
                    <div className="flex items-center ">
                      <ClipLoader size={16} color={'#123abc'} />

                      <div className="ml-2">Compiling</div>
                    </div>
                  ) : (
                    <div className="flex items-center ">
                      <div className="text-bold text-green-600">✓</div>
                      <div className="ml-2">Compiled</div>
                    </div>
                  )}
                  {isUploading ? (
                    <div className="flex items-center ">
                      <ClipLoader size={16} color={'#123abc'} />

                      <div className="ml-2">Uploading</div>
                    </div>
                  ) : (
                    <div className="flex items-center ">
                      <div className="text-bold text-green-600">✓</div>
                      <div className="ml-2">Uploaded</div>
                    </div>
                  )}
                  <pre className="text-xs bg-blueGray-100 p-4 rounded-md mt-4">
                    {compileOutput}
                  </pre>
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default Setup;
