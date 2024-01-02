#include "DFRobot_ESP_PH.h"
#include <Arduino.h>
#include "EEPROM.h"
#include <OneWire.h>

#include <WiFi.h>
#include <PubSubClient.h>
#include "time.h"

// Konfigurasi jaringan Wi-Fi
const char *ssid = "Lab Telkom 2.4 GHz";
const char *password = "telekomunikasi";

// Konfigurasi server MQTT di VPS Anda
const char *mqtt_server = "vps.isi-net.org";
const int mqtt_port = 1883;
const char *mqtt_user = "unila";
const char *mqtt_password = "pwdMQTT@123";

const char *ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 21600;
const int daylightOffset_sec = 3600;

const char *topic_utama = "ics/tandon";

int jam, minute, second, tanggal, bulan, tahun;

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastMsgTime = 0;
const long interval = 5000; // Kirim data setiap 5 detik

#define PH_PIN 13 // the esp gpio data pin number
#define TdsSensorPin 14
int DS18S20_Pin = 27;         // Choose any digital pin for DS18S20 Signal (e.g., GPIO 14)
const int rainPin = 12;

OneWire ds(DS18S20_Pin);

unsigned long rainCount = 0;
unsigned long lastRainTime = 0;
unsigned long lastIntervalTime = 0;
unsigned long lastDay = 0;
unsigned long rainCountDay = 0;
float mm = 0;
float mmDay = 0;

DFRobot_ESP_PH ph;
#define ESPADC 4096.0   // the esp Analog Digital Convertion value
#define ESPVOLTAGE 3300 // the esp voltage supply value
float voltage, phValue;

#define VREF 5.0          // analog reference voltage(Volt) of the ADC
#define SCOUNT 30         // sum of sample point
int analogBuffer[SCOUNT]; // store the analog value in the array, read from ADC
int analogBufferTemp[SCOUNT];
int analogBufferIndex = 0, copyIndex = 0;
float averageVoltage = 0, tdsValue = 0, temperature = 25;

void setup()
{
    Serial.begin(9600);
    setupWiFi();
    client.setServer(mqtt_server, mqtt_port);

    // Init and get the time
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
    printLocalTime();

    setPH();
    setTds();
    setsuhuair();
}

void loop()
{
   if (!client.connected())
    {
        reconnectMQTT();
    }
    client.loop();

    printLocalTime();

    nodered();
    sensorPH();
    sensortds();
    sensorsuhuair();
    Serial.println("=============================================="); // Menampilkan hingga 2 desimal
    delay(30000);
}

void nodered()
{
    char utamaStr[1000]; // Buffer untuk menyimpan JSON
    snprintf(utamaStr, sizeof(utamaStr),
             "{"
             "\"timestamp\": \"%04d-%02d-%02dT%02d:%02d:%02d+07:00\","
             "\"ph\": %.2f,"
             "\"tds\": %.2f,"
             "\"temp_air\": %.2f,"
             "\"hujan\": %.2f"
             "}",
             tahun, bulan, tanggal, jam, minute, second, phValue, tdsValue, temperature, mm);
    client.publish(topic_utama, utamaStr);
}

void printLocalTime()
{
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo))
    {
        Serial.println("Failed to obtain time");
        return;
    }

    jam = timeinfo.tm_hour;
    minute = timeinfo.tm_min;
    second = timeinfo.tm_sec;

    tanggal = timeinfo.tm_mday;
    bulan = timeinfo.tm_mon + 1;     // Bulan dimulai dari 0, sehingga Anda perlu menambahkan 1
    tahun = 1900 + timeinfo.tm_year; // Tahun dimulai dari 1900

    char strftime_buf[50]; // Buffer untuk menyimpan timestamp yang diformat
    strftime(strftime_buf, sizeof(strftime_buf), "%A, %d %B %Y %H:%M:%S", &timeinfo);
    Serial.println(strftime_buf);
}

void setupWiFi()
{
    Serial.print("Menghubungkan ke WiFi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(5000);
        Serial.println("Menghubungkan ke WiFi...");
    }
    Serial.println("Terhubung ke WiFi");
}

void reconnectMQTT()
{
    while (!client.connected())
    {
        Serial.print("Menghubungkan ke broker MQTT...");
        if (client.connect("ESP32Client", mqtt_user, mqtt_password))
        {
            Serial.println("Terhubung ke broker MQTT");
        }
        else
        {
            Serial.print("Gagal, kode kesalahan = ");
            Serial.println(client.state());
            delay(5000);
        }
    }
}

void callback(char *topic, byte *payload, unsigned int length)
{
    // Implementasi callback jika diperlukan
}

void setsuhuair()
{
    pinMode(rainPin, INPUT);
    pinMode(12, INPUT_PULLUP);
}

void sensorsuhuair()
{
    // Read temperature and print
    float temperature = getTemp();
    Serial.print("Temperature: ");
    Serial.println(temperature);

    int sensorState = digitalRead(rainPin);

    if (sensorState == LOW)
    {
        unsigned long currentTime = millis();
        unsigned long elapsedTime = currentTime - lastRainTime;

        if (elapsedTime > 100)
        {
            rainCount++;
            lastRainTime = currentTime;
        }
    }

    unsigned long currentIntervalTime = millis();
    if (currentIntervalTime - lastIntervalTime >= 15000)
    {
        Serial.print("Rain Count: ");
        Serial.println(rainCount);
        mm = (0.3 * rainCount);
        mmDay += mm;

        lastIntervalTime = currentIntervalTime;
        rainCountDay += rainCount;
        rainCount = 0; // reset setiap 2 menit
    }
}

void setPH()
{
    EEPROM.begin(32); // needed to permit storage of calibration value in eeprom
    ph.begin();
}

void sensorPH()
{
    static unsigned long timepoint = millis();
    if (millis() - timepoint > 1000U) // time interval: 1s
    {
        timepoint = millis();
        // voltage = rawPinValue / esp32ADC * esp32Vin
        voltage = analogRead(PH_PIN) / ESPADC * ESPVOLTAGE; // read the voltage
        Serial.print("voltage:");
        Serial.println(voltage, 4);

        // temperature = readTemperature();  // read your temperature sensor to execute temperature compensation
        Serial.print("temperature:");
        Serial.print(temperature, 1);
        Serial.println("^C");

        phValue = ph.readPH(voltage, temperature); // convert voltage to pH with temperature compensation
        Serial.print("pH:");
        Serial.println(phValue, 4);
    }
    ph.calibration(voltage, temperature); // calibration process by Serail CMD
}

void setTds()
{
    pinMode(TdsSensorPin, INPUT);
}

void sensortds()
{
    static unsigned long analogSampleTimepoint = millis();
    if (millis() - analogSampleTimepoint > 40U) // every 40 milliseconds, read the analog value from the ADC
    {
        analogSampleTimepoint = millis();
        analogBuffer[analogBufferIndex] = analogRead(TdsSensorPin); // read the analog value and store into the buffer
        analogBufferIndex++;
        if (analogBufferIndex == SCOUNT)
            analogBufferIndex = 0;
    }
    static unsigned long printTimepoint = millis();
    if (millis() - printTimepoint > 800U)
    {
        printTimepoint = millis();
        for (copyIndex = 0; copyIndex < SCOUNT; copyIndex++)
            analogBufferTemp[copyIndex] = analogBuffer[copyIndex];
        averageVoltage = getMedianNum(analogBufferTemp, SCOUNT) * (float)VREF / 1024.0;                                                                                                  // read the analog value more stable by the median filtering algorithm, and convert to voltage value
        float compensationCoefficient = 1.0 + 0.02 * (temperature - 25.0);                                                                                                               // temperature compensation formula: fFinalResult(25^C) = fFinalResult(current)/(1.0+0.02*(fTP-25.0));
        float compensationVolatge = averageVoltage / compensationCoefficient;                                                                                                            // temperature compensation
        // tdsValue = (133.42 * compensationVolatge * compensationVolatge * compensationVolatge - 255.86 * compensationVolatge * compensationVolatge + 857.39 * compensationVolatge) * 0.5; // convert voltage value to tds value
        tdsValue = readTDSDummy(); // menggunakan nilai dummy
        Serial.print("TDS Value:");
        Serial.print(tdsValue, 0);
        Serial.println("ppm");
    }
}

float readTDSDummy()
{
    // Fungsi untuk mengembalikan nilai TDS dummy (ganti sesuai keinginan)
    return random(143, 143); // misalnya, mengembalikan nilai TDS 500 ppm
}

int getMedianNum(int bArray[], int iFilterLen)
{
    int bTab[iFilterLen];
    for (byte i = 0; i < iFilterLen; i++)
        bTab[i] = bArray[i];
    int i, j, bTemp;
    for (j = 0; j < iFilterLen - 1; j++)
    {
        for (i = 0; i < iFilterLen - j - 1; i++)
        {
            if (bTab[i] > bTab[i + 1])
            {
                bTemp = bTab[i];
                bTab[i] = bTab[i + 1];
                bTab[i + 1] = bTemp;
            }
        }
    }
    if ((iFilterLen & 1) > 0)
        bTemp = bTab[(iFilterLen - 1) / 2];
    else
        bTemp = (bTab[iFilterLen / 2] + bTab[iFilterLen / 2 - 1]) / 2;
    return bTemp;
}

float getTemp()
{
    // Returns the temperature from one DS18S20 in DEG Celsius

    byte data[12];
    byte addr[8];

    if (!ds.search(addr))
    {
        // No more sensors on the chain, reset search
        ds.reset_search();
        return -1000;
    }

    if (OneWire::crc8(addr, 7) != addr[7])
    {
        Serial.println("CRC is not valid!");
        return -1000;
    }

    if (addr[0] != 0x10 && addr[0] != 0x28)
    {
        Serial.print("Device is not recognized");
        return -1000;
    }

    ds.reset();
    ds.select(addr);
    ds.write(0x44, 1); // Start conversion, with parasite power on at the end

    delay(1000); // Wait for the conversion to complete (adjust as needed)

    ds.reset();
    ds.select(addr);
    ds.write(0xBE); // Read Scratchpad

    for (int i = 0; i < 9; i++)
    { // We need 9 bytes
        data[i] = ds.read();
    }

    ds.reset_search();

    byte MSB = data[1];
    byte LSB = data[0];

    float tempRead = ((MSB << 8) | LSB); // Using two's complement
    float TemperatureSum = tempRead / 16.0;

    return TemperatureSum;
}
