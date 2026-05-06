//% color="#0000ff" icon="\uf06d" block="Test"
namespace test {

    //% block="set test value %val"
    //% val.shadow="range" val.min=0 val.max=100 val.defl=50
    export function setValue(val: number): void {
        basic.showNumber(val)
    }
}
