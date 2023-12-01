input.onButtonEvent(Button.AB, ButtonEvent.LongClick, function () {
    basic.showString("1BE7S")
})
radio.onReceivedNumber(function (receivedNumber) {
    btLaufzeit = input.runningTime()
    if (bStop) {
        _("bei Stop keine Funktion über Bluetooth aufrufen")
    } else if (receivedNumber >= 900 && receivedNumber <= 1100) {
        _("900 ... 1100 MotorPower (- 1000)")
        iMotorPower = receivedNumber - 1000
    } else if (receivedNumber >= 45 && receivedNumber <= 135) {
        _("0 ... 180 Servo Winkel")
        radio.sendNumber(ServoSteuerung(receivedNumber))
    }
})
function Bit (bool: boolean) {
    if (bool) {
        return 1
    } else {
        return 0
    }
}
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    if (!(btConnected)) {
        iLichtstärke += -1
        _4digit.show(iLichtstärke)
        basic.pause(5000)
    }
})
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    _4digit.show(input.lightLevel())
    basic.pause(5000)
})
function Licht () {
    if (!(bLichtan) && !(iMotorPower == 0) && input.lightLevel() < iLichtstärke) {
        bLichtan = true
        pins.digitalWritePin(DigitalPin.P3, 0)
    } else if (bLichtan && iMotorPower == 0) {
        bLichtan = false
        basic.pause(5000)
        pins.digitalWritePin(DigitalPin.P3, 1)
    }
}
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    if (!(btConnected)) {
        iLichtstärke += 1
        _4digit.show(iLichtstärke)
        basic.pause(5000)
    }
})
function _ (Kommentar: string) {
	
}
function ServoSteuerung (pWinkel: number) {
    if (!(btConnected)) {
        _("Bluetooth unterbrochen")
        iWinkel = 90
    } else if (iWinkel != pWinkel) {
        _("connected und Wert geändert")
        iWinkel = pWinkel
        _4digit.show(iWinkel)
        pins.servoWritePin(AnalogPin.P1, iWinkel)
    }
    return iWinkel
}
/**
 * P0 frei; P1 Servo; P2 Fototransistor; P3 LED
 */
let iWinkel = 0
let bLichtan = false
let iMotorPower = 0
let btLaufzeit = 0
let btConnected = false
let iLichtstärke = 0
let bStop = false
let _4digit: grove.TM1637 = null
_("Erweiterungen Funk und Grove laden")
_4digit = grove.createDisplay(DigitalPin.C16, DigitalPin.C17)
_4digit.point(false)
_4digit.set(7)
radio.setGroup(60)
bStop = false
iLichtstärke = 22
_("btConnected wahr damit ServoSteuerung funktioniert")
btConnected = true
btLaufzeit = input.runningTime()
ServoSteuerung(90)
loops.everyInterval(500, function () {
    _("Überwachung der Bluetooth Connection")
    if (input.runningTime() - btLaufzeit < 1000) {
        if (!(btConnected)) {
            btConnected = true
            basic.setLedColor(0x00ff00)
        }
    } else {
        btConnected = false
        if (Math.trunc(input.runningTime() / 1000) % 2 == 1) {
            basic.setLedColor(0x0000ff)
        } else {
            basic.turnRgbLedOff()
        }
    }
    Licht()
})
