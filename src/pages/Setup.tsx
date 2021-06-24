/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../components/Card';
import { RootState } from '../redux/store';
import { getDashboardInfo } from '../redux/actions/appActions';
import { DashboardData, Device } from '../types';
import ClipLoader from 'react-spinners/ClipLoader';
import { Link } from 'react-router-dom';
import { getDevices } from '../redux/actions/deviceActions';
import Swal from 'sweetalert2';

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
                 : ``
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

       dht.begin();
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
      String url${i} = ${host} + "/api/device/update-temperature/" + ${v.device.id};

      float newTemp = dht.readTemperature();

      if (isnan(newTemp)) {
        Serial.println("Failed to read from DHT sensor!");
      }

      http${i}.begin(url${i}.c_str());
      http${i}.addHeader("Content-Type", "text/plain");

      if (temp != newTemp) {
        temp = newTemp;
        Serial.println(temp);

        int httpResponseCode = http${i}.POST(String(newTemp, 1));

        if (httpResponseCode>0) {
          Serial.print("HTTP Response code: ");
          Serial.println(httpResponseCode);
        }
        else {
          Serial.print("Error code: ");
          Serial.println(httpResponseCode);
        }
      // Free resources
      http${i}.end();
      }
      `
          : `
      // DEVICE 1
      HTTPClient http${i};

      String url${i} = ${host} + "/api/device-from-mc/" + ${v.device.id} + "?options=keyValues";

      // Your Domain name with URL path or IP address with path
      http${i}.begin(url${i}.c_str());
      http${i}.addHeader("fiware-service", "openiot");
      http${i}.addHeader("fiware-servicepath", "/");
      // Send HTTP GET request
      int httpResponseCode = http${i}.GET();

      if (httpResponseCode>0) {
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
        Serial.println(httpResponseCode);
      }
      // Free resources
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
  const user = useSelector((state: RootState) => state.auth.user);

  const [loading, setLoading] = React.useState(true);
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [selectedDevices, setSelectedDevices] = React.useState<
    { device: Device; pin: string }[]
  >([]);

  React.useEffect(() => {
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

  return (
    <div>
      {loading ? (
        <div className="h-40 flex justify-center items-center">
          <ClipLoader size={40} color={'#123abc'} />
        </div>
      ) : (
        <Card className="bg-white flex items-start space-x-10">
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
            <div className="font-bold mb-4">Sketch Output</div>
            <pre className="text-xs bg-blueGray-100 p-4 rounded-md">
              {generateSketch({
                devices: selectedDevices,
                host: 'http://192.16.1.5:3002',
                pass: 'IndihomeTai123',
                ssid: 'TEST',
              })}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Setup;
