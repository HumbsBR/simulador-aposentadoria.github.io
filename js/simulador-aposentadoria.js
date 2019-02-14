//Formatando inputs
function conv_number(expr, decplaces) {
    var str = "" + Math.round(eval(expr) * Math.pow(10, decplaces));
    while (str.length <= decplaces) {
        str = "0" + str;
    }

    var decpoint = str.length - decplaces;
    return (str.substring(0, decpoint) + "." + str.substring(decpoint, str.length));
}

//Valores Fixos:
var parcial = 4.5 / 100; //taxa de juros anual
var rate = Math.pow((1 + parcial), (1 / 12)) - 1; //taxa de juros mensal
var type = 1; //deixar default
var beginningBalance, endingBalance;

//Inputs do Usuário:
var periods = 360; //quantidade de meses juntando dinheiro
var lifeexpectancy = 360; //expectativa de vida
var payment = 7500; //objetivo de aposentadoria
var future = 500000; //valor de herança
var initial = 500000; //valor que tenho disponível agora
var deposit = 1500; //depósitos mensais

// Função para cálculo do valor Presente:
function pv(rate, nper, pmt, fv) {
    rate = parseFloat(rate);
    nper = parseFloat(nper);
    pmt = parseFloat(pmt);
    fv = parseFloat(fv);
    if (nper == 0) {
        alert("Why do you want to test me with zeros?");
        return (0);
    }
    if (rate == 0) { // Interest rate is 0
        pv_value = -(fv + (pmt * nper));
    } else {
        x = Math.pow(1 + rate, -nper);
        y = Math.pow(1 + rate, nper);
        pv_value = -(x * (fv * rate - pmt + y * pmt)) / rate;
    }
    pv_value = conv_number(pv_value, 2);
    return (pv_value);
}

// Função para cálculo do valor Futuro:
function PMT(rate, nperiod, pv, fv, type) {
    if (!fv) fv = 0;
    if (!type) type = 0;

    if (rate == 0) return -(pv + fv) / nperiod;

    var pvif = Math.pow(1 + rate, nperiod);
    var pmt = rate / (pvif - 1) * -(pv * pvif + fv);

    if (type == 1) {
        pmt /= (1 + rate);
    };

    return pmt;
}

function FV(rate, nper, pmt, pv, type) {
    var pow = Math.pow(1 + rate, nper),
        fv;
    if (rate) {
        fv = (pmt * (1 + rate * type) * (1 - pow) / rate) - pv * pow;
    } else {
        fv = -1 * (pv + pmt * nper);
    }
    return fv.toFixed(2);
}

var myArray = new Array();
var myArray2 = new Array();
var CenarioA = new Array();

var myArrayB = new Array();
var myArrayB2 = new Array();
var CenarioB = new Array();

var myArrayC = new Array();
var myArrayC2 = new Array();
var CenarioC = new Array();

var vp = pv(rate, periods, payment, future, type);
vp = vp * -1;

vp_temp = vp * -1 //Valor 1

var result = PMT(rate, lifeexpectancy, initial, vp_temp, 0);

beginningBalance = endingBalance = initial;

for (var a = 0; a <= periods; a++) {
    beginningBalance = endingBalance
    endingBalance = parseFloat(beginningBalance * (1 + rate) + result);

    myArray[a] = beginningBalance;

}

var lastItem = myArray.pop();
beginningBalance2 = endingBalance2 = lastItem;

for (var b = 0; b <= lifeexpectancy; b++) {
    beginningBalance2 = endingBalance2;
    endingBalance2 = parseFloat((beginningBalance2 - payment) + (beginningBalance2 * rate));

    if (endingBalance2 > future) {
        myArray2[b] = endingBalance2;
    } else {
        myArray2[b] = future;
    }

}

CenarioA = myArray.concat(myArray2);

console.log("Cenário A:");
console.log(CenarioA);

var CaixaTeorico, ObjetivoMensalTeorico;

CaixaTeorico = FV(rate, lifeexpectancy, deposit, initial, 0);
CaixaTeorico = CaixaTeorico * -1;

ObjetivoMensalTeorico = PMT(rate, lifeexpectancy, CaixaTeorico * -1, future, 0);

beginningBalance = endingBalance = initial;

for (var a = 0; a <= periods; a++) {
    beginningBalance = endingBalance
    endingBalance = parseFloat(beginningBalance * (1 + rate) + deposit);

    myArrayB[a] = beginningBalance;

}

lastItem = myArrayB.pop();
beginningBalance2 = endingBalance2 = lastItem;

for (var b = 0; b <= lifeexpectancy; b++) {
    beginningBalance2 = endingBalance2;
    endingBalance2 = parseFloat((beginningBalance2 - ObjetivoMensalTeorico) + (beginningBalance2 * rate));

    if (endingBalance2 > future) {
        myArrayB2[b] = endingBalance2;
    } else {
        myArrayB2[b] = future;
    }

}

CenarioB = myArrayB.concat(myArrayB2);

console.log("Cenário B:");
console.log(CenarioB);

var CaixaTeorico, HerancaTeorica;

CaixaTeorico = FV(rate, lifeexpectancy, deposit, initial, 0);
CaixaTeorico = CaixaTeorico * -1; //Valor 1
HerancaTeorica = FV(rate, lifeexpectancy, payment * -1, CaixaTeorico, 0);
HerancaTeorica = HerancaTeorica * -1; //Valor 1

beginningBalance = endingBalance = initial;

for (var a = 0; a <= periods; a++) {
    beginningBalance = endingBalance
    endingBalance = parseFloat(beginningBalance * (1 + rate) + deposit);

    myArrayC[a] = beginningBalance;

}

lastItem = myArrayC.pop();
beginningBalance2 = endingBalance2 = lastItem;

for (var b = 0; b <= lifeexpectancy; b++) {
    beginningBalance2 = endingBalance2;
    endingBalance2 = parseFloat((beginningBalance2 - payment) + (beginningBalance2 * rate));

    if (endingBalance2 >= HerancaTeorica) {
        myArrayC2[b] = HerancaTeorica;
    } else {
        myArrayC2[b] = endingBalance2;
    }

}

CenarioC = myArrayC.concat(myArrayC2);

console.log("Cenário C:");
console.log(CenarioC);
