
#include <ESP8266WiFi.h> 

#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>

#define DHTTYPE    DHT11

const char *ssid =  "TEST";
const char *pass =  "IndihomeTai123";

String host = "http://192.168.1.5:3002";

int PIN_5 = 5;
String ID_5 = "urn:ngsi-ld:Lamp:001";


int PIN_4 = 4;
String ID_4 = "urn:ngsi-ld:Temperature:001";

DHT dht(PIN_4, DHTTYPE);


float temp = 0.0;

WiFiClient client;

void setup()
{
       Serial.begin(9600);
       delay(10);

       
        pinMode(PIN_5, OUTPUT);
        dht.begin();
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
      
      

      HTTPClient http0;

      String url0 = host + "/api/device-from-mc/" + "urn:ngsi-ld:Lamp:001" + "?options=keyValues";

      http0.begin(url0.c_str());
      http0.addHeader("fiware-service", "openiot");
      http0.addHeader("fiware-servicepath", "/");
      int httpResponseCode0 = http0.GET();

      if (httpResponseCode0>0) {
        String payload = http0.getString();
        DynamicJsonDocument jsonResponse(1024);
        deserializeJson(jsonResponse, payload);

        const char* state = jsonResponse["state"];
        const char* offState = "off";
        const char* onState = "on";

        if(strcmp(state, offState) == 0) {
          digitalWrite(5, HIGH);
        } else if (strcmp(state, onState) == 0) {
          digitalWrite(5, LOW);
        }
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode0);
      }

      http0.end();
      
      
      
      HTTPClient http1;
      String url1 = host + "/api/device/update-temperature/" + "urn:ngsi-ld:Temperature:001";

      float newTemp = dht.readTemperature();

      if (isnan(newTemp)) {
        Serial.println("Failed to read from DHT sensor!");
      }

      http1.begin(url1.c_str());
      http1.addHeader("Content-Type", "text/plain");

      if (temp != newTemp) {
        temp = newTemp;
        Serial.println(temp);

        int httpResponseCode1 = http1.POST(String(newTemp, 1));

        if (httpResponseCode1>0) {
          Serial.print("HTTP Response code: ");
          Serial.println(httpResponseCode1);
        }
        else {
          Serial.print("Error code: ");
          Serial.println(httpResponseCode1);
        }

      http1.end();
      }
      
      
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    delay(1000);
}

