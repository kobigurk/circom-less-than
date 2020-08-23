const chai = require("chai");
const path = require("path");

const tester = require("circom").tester;

const buildBn128 = require('ffjavascript').buildBn128;

const assert = chai.assert;

describe("Comparators test", function ()  {

    let bn128;
    let Fr;

    this.timeout(100000);

    before( async() => {
        bn128 = await buildBn128();
        Fr = bn128.Fr;
    });

    after( async() => {
        bn128.terminate();
    });


    it("Should create a comparison lessthan", async() => {
        const circuit = await tester(path.join(__dirname, "example.circom"));

        let witness = await circuit.calculateWitness({ "in": [0,1] });
        await circuit.loadSymbols();
        let output = witness[circuit.symbols["main.result"].varIdx];
        let decoratedOutput = await circuit.getDecoratedOutput(witness);
        let expectedBits = '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011000001100100010011100111001011100001001100011010000000101001101110000101000001000101101101101000000110000001010110000101110100101000001100111110100001001000011110011011100101110000100100010100001111100001111101011001001111110000000000000000000000000000';
        for (let i = 0; i < expectedBits.length; i++) {
            assert.equal(expectedBits[expectedBits.length - 1 - i], witness[circuit.symbols[`main.c.n2b.out[${i}]`].varIdx]);
        }

        console.log(`result: ${output}`);
        //console.log(`decorated: ${decoratedOutput}`);

        await circuit.checkConstraints(witness);

        let alternativeBits = '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001001000100101100111010110101100010100011100101001110000001111101001010001111000011010001001000111000010010000100000010010001011101111000100110111011100011011001011011010010110001010001101100111100101110100101111000001011101111010000000000000000000000000010';
        for (let i = 0; i < alternativeBits.length; i++) {
            witness[circuit.symbols[`main.c.n2b.out[${i}]`].varIdx] = circuit.F.e(alternativeBits[alternativeBits.length - 1 - i]);
        }
        console.log(`254 bit: ${witness[circuit.symbols[`main.c.n2b.out[254]`].varIdx]}`);
        await circuit.checkConstraints(witness);

        assert.notEqual(expectedBits, alternativeBits);

    });
});
