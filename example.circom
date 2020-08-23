include "node_modules/circomlib/circuits/comparators.circom";

template LessThanTester() {
    signal input in[2];
    signal output result;

    component c = LessThan(254);
    c.in[0] <== in[0];
    c.in[1] <== in[1];
    c.out ==> result;
}

component main = LessThanTester();