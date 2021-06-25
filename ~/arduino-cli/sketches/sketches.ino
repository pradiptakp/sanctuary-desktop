
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


float temp = 0.0;

WiFiClient client;

void setup()
{
       Serial.begin(9600);
       delay(10);

       
        pinMode(PIN_5, OUTPUT);
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
      
      
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    delay(1000);
}

