//% color="#ff6600" icon="\uf06d" block="Candle"
namespace candle {

    let _strip: neopixel.Strip = null
    let currentR = 0
    let currentG = 0
    let currentB = 0
    let gustTimer = 0

    let _rDim = 100
    let _gDim = 40
    let _bDim = 5
    let _rBright = 226
    let _gBright = 100
    let _bBright = 10
    let _flickerAmount = 70
    let _smoothDown = 2
    let _smoothUp = 5
    let _gustChance = 10
    let _gustStrength = 80

    /**
     * Set up the candle on a NeoPixel strip
     */
    //% block="set up candle on pin %pin with %numLeds LEDs at brightness %brightness"
    //% brightness.min=0 brightness.max=255 brightness.fieldEditor="slider"
    //% numLeds.min=1 numLeds.max=30
    export function setup(pin: DigitalPin, numLeds: number, brightness: number): void {
        _strip = neopixel.create(pin, numLeds, NeoPixelMode.RGB)
        _strip.clear()
        _strip.show()
        _strip.setBrightness(brightness)
    }

    /**
     * Set the dim colour (gust end)
     */
    //% block="set dim colour R%r G%g B%b"
    //% r.min=0 r.max=255 r.fieldEditor="slider"
    //% g.min=0 g.max=255 g.fieldEditor="slider"
    //% b.min=0 b.max=255 b.fieldEditor="slider"
    export function setDimColour(r: number = 100, g: number = 40, b: number = 5): void {
        _rDim = r
        _gDim = g
        _bDim = b
    }

    /**
     * Set the bright colour (steady end)
     */
    //% block="set bright colour R%r G%g B%b"
    //% r.min=0 r.max=255 r.fieldEditor="slider"
    //% g.min=0 g.max=255 g.fieldEditor="slider"
    //% b.min=0 b.max=255 b.fieldEditor="slider"
    export function setBrightColour(r: number = 226, g: number = 100, b: number = 10): void {
        _rBright = r
        _gBright = g
        _bBright = b
    }

    /**
     * Set the flicker behaviour
     */
    //% block="set flicker amount%flickerAmount gust chance%gustChance gust strength%gustStrength smooth down%smoothDown smooth up%smoothUp"
    //% flickerAmount.min=0 flickerAmount.max=100 flickerAmount.fieldEditor="slider"
    //% gustChance.min=0 gustChance.max=100 gustChance.fieldEditor="slider"
    //% gustStrength.min=0 gustStrength.max=100 gustStrength.fieldEditor="slider"
    //% smoothDown.min=2 smoothDown.max=10 smoothDown.fieldEditor="slider"
    //% smoothUp.min=2 smoothUp.max=15 smoothUp.fieldEditor="slider"
    export function setFlickerBehaviour(
        flickerAmount: number = 70,
        gustChance: number = 10,
        gustStrength: number = 80,
        smoothDown: number = 2,
        smoothUp: number = 5
    ): void {
        _flickerAmount = flickerAmount
        _gustChance = gustChance
        _gustStrength = gustStrength
        _smoothDown = smoothDown
        _smoothUp = smoothUp
    }

    /**
     * Run one frame of the candle flicker effect
     */
    //% block="flicker candle"
    export function flicker(): void {
        if (_strip == null) return

        if (gustTimer > 0) {
            gustTimer = gustTimer - 1
        } else if (Math.randomRange(0, 100) < _gustChance) {
            gustTimer = Math.randomRange(3, 8)
        }

        let flickerVal = Math.randomRange(0, _flickerAmount)
        if (gustTimer > 0) {
            flickerVal = Math.min(100, flickerVal + _gustStrength)
        }

        let targetR = _rBright + Math.idiv((_rDim - _rBright) * flickerVal, 100)
        let targetG = _gBright + Math.idiv((_gDim - _gBright) * flickerVal, 100)
        let targetB = _bBright + Math.idiv((_bDim - _bBright) * flickerVal, 100)

        let smoothR = targetR < currentR ? _smoothDown : _smoothUp
        let smoothG = targetG < currentG ? _smoothDown : _smoothUp
        let smoothB = targetB < currentB ? _smoothDown : _smoothUp

        let stepR = Math.idiv(targetR - currentR, smoothR)
        if (targetR != currentR && stepR == 0) { stepR = targetR > currentR ? 1 : -1 }
        currentR = currentR + stepR

        let stepG = Math.idiv(targetG - currentG, smoothG)
        if (targetG != currentG && stepG == 0) { stepG = targetG > currentG ? 1 : -1 }
        currentG = currentG + stepG

        let stepB = Math.idiv(targetB - currentB, smoothB)
        if (targetB != currentB && stepB == 0) { stepB = targetB > currentB ? 1 : -1 }
        currentB = currentB + stepB

        _strip.setPixelColor(0, neopixel.rgb(currentR, currentG, currentB))
        _strip.show()
    }
}
