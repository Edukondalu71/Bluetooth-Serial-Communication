package com.BTSwitch

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.bluetooth.BluetoothAdapter
import android.content.Intent
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.uimanager.ViewManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray

import android.bluetooth.BluetoothSocket
import android.os.Build
import androidx.annotation.RequiresApi
import java.io.IOException
import java.util.UUID

import com.facebook.react.bridge.*

import java.io.OutputStream
import java.util.*
import android.os.Handler

class BluetoothModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val bluetoothAdapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()
    private val MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB")
    private var currentSocket: BluetoothSocket? = null

    override fun getName(): String {
        return "BluetoothModule"
    }

    // Enable Bluetooth
    @ReactMethod
    fun enableBluetooth(promise: Promise) {
        if (bluetoothAdapter == null) {
            promise.reject("Bluetooth not supported", "Bluetooth is not supported on this device")
        } else if (bluetoothAdapter?.isEnabled == true) {
            promise.resolve("Bluetooth already enabled")
        } else {
            val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
            enableBtIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(enableBtIntent)
            promise.resolve("Bluetooth enable request sent")
        }
    }

    // Check Bluetooth status
    @ReactMethod
    fun checkBluetoothStatus(promise: Promise) {
        if (bluetoothAdapter == null) {
            promise.reject("Bluetooth not supported", "Bluetooth is not supported on this device")
        } else {
            promise.resolve(bluetoothAdapter.isEnabled)
        }
    }

    // Scan for paired devices
    @ReactMethod
    fun getPairedDevices(promise: Promise) {
        if (bluetoothAdapter != null) {
            val pairedDevices = bluetoothAdapter.bondedDevices.map {
                // Convert each paired device to a map containing the name and address
                mapOf("name" to it.name, "address" to it.address)
            }
            
            // Convert the paired devices list to a WritableArray for React Native
            val writableArray = Arguments.createArray()
            pairedDevices.forEach { device ->
                val deviceMap = Arguments.createMap()
                deviceMap.putString("name", device["name"])
                deviceMap.putString("address", device["address"])
                writableArray.pushMap(deviceMap)
            }
            
            promise.resolve(writableArray)
        } else {
            promise.reject("Bluetooth not supported", "Bluetooth is not supported on this device")
        }
    }

    // Connect to a device
    // Connect to the Bluetooth device
    @RequiresApi(Build.VERSION_CODES.GINGERBREAD_MR1)
    @ReactMethod
    fun connectToDevice(deviceAddress: String, promise: Promise) {
        val device = bluetoothAdapter?.getRemoteDevice(deviceAddress)
        if (device != null) {
            var socket: BluetoothSocket? = null
            try {
                // Get a Bluetooth socket for the specified UUID (SPP in this case)
                socket = device.createRfcommSocketToServiceRecord(MY_UUID)
    
                // Cancel discovery to speed up the connection
                bluetoothAdapter?.cancelDiscovery()
    
                // Set up a handler to simulate a timeout (e.g., 15 seconds)
                val timeoutHandler = Handler()
                val timeoutRunnable = Runnable {
                    socket?.close() // Close the socket if the connection times out
                    promise.reject("Connection Timeout", "Failed to connect to device: Connection timed out")
                }
                timeoutHandler.postDelayed(timeoutRunnable, 15000) // Timeout after 15 seconds
    
                // Connect to the device
                socket.connect()
    
                // Remove the timeout handler if connection is successful
                timeoutHandler.removeCallbacks(timeoutRunnable)
    
                // Set the current socket for later communication
                currentSocket = socket
    
                // If connection is successful, resolve the promise
                promise.resolve("Connected to device: ${device.name}")
            } catch (e: IOException) {
                // Handle connection error
                e.printStackTrace()
                promise.reject("Connection failed", "Failed to connect to device: ${e.message}")
            }
        } else {
            promise.reject("Device not found", "Bluetooth device not found")
        }
    }
    
    // Disconnect Bluetooth
    @ReactMethod
    fun disconnectBluetooth(promise: Promise) {
        // Handle Bluetooth disconnection logic here
        promise.resolve("Bluetooth disconnected")
    }

    @ReactMethod
    fun write(command: String, promise: Promise) {
        val socket = currentSocket

        if (socket != null && socket.isConnected) {
            try {
                // Get the output stream of the Bluetooth socket
                val outputStream: OutputStream = socket.outputStream

                // Convert the command string to a byte array and send it
                outputStream.write(command.toByteArray())
                outputStream.flush()

                // Resolve the promise indicating successful write
                promise.resolve("Command sent: $command")
            } catch (e: IOException) {
                // Handle the error if writing fails
                e.printStackTrace()
                promise.reject("Write failed", "Failed to write command: ${e.message}")
            }
        } else {
            promise.reject("Not connected", "Bluetooth device is not connected")
        }
    }
}
