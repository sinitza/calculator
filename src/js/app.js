angular
    .module('Calculator', [])
    .service('LocalStorage', LocalStorage)
    .controller('CalculatorCtrl', CalculatorCtrl);

function LocalStorage() {
    return {
        getNumber: function () {
            return JSON.parse(localStorage.getItem('calc') || 0);
        },
        setNumber: function (num) {
            return localStorage.setItem('calc', JSON.stringify(num));
        },
        removeNumber: function () {
            return localStorage.removeItem('calc');
        }
    }
}

function CalculatorCtrl($scope, $http, LocalStorage) {
    $scope.valuteArray = [];
    $scope.inputDisplay = "";
    $scope.expression = "";
    $scope.ans = 0;
    $scope.pendingOperation = null;
    $scope.pendingValue = null;


    //API request
    $http.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')
        .then(function success(data) {
            console.log('data', data);
            $scope.valuteArray = data.data;
            console.log('valuteArray', $scope.valuteArray)
        }, function error(data) {
            console.log('ERROR: not data');
        });

    //enter keybord
    $scope.keypressEnter = function ($event) {
        console.log($event.key);
        switch ($event.key) {
            case "0" :
            case "1" :
            case "2" :
            case "3" :
            case "4" :
            case "5" :
            case "6" :
            case "7" :
            case "8" :
            case "9" : {
                $scope.inputDisplay += $event.key;
                $scope.expresA += $event.key;
                break;
            };
            // case "+" : ;
            // case "-" : ;
            // case "/" : ;
            // case "" : ;
        }
    };

    $scope.addToStorage = function () {
        console.log(LocalStorage.getNumber());
        if ($scope.inputDisplay) {
            LocalStorage.setNumber(LocalStorage.getNumber() + parseFloat($scope.inputDisplay));
        } else if ($scope.inputDisplay = '') {
            LocalStorage.setNumber(LocalStorage.getNumber() + $scope.ans);
        }
    };

    $scope.subToStorage = function () {
        if ($scope.inputDisplay) {
            console.log(LocalStorage.getNumber(), $scope.inputDisplay);
            LocalStorage.setNumber(LocalStorage.getNumber() - parseFloat($scope.inputDisplay));
        } else if ($scope.inputDisplay = '') {
            LocalStorage.setNumber(LocalStorage.getNumber() - $scope.ans);
        }
    };

    $scope.insertFromStorage = function () {
        $scope.inputDisplay = LocalStorage.getNumber();
    };

    $scope.removeStorage = function () {
        LocalStorage.removeNumber();
    };

    //clear display
    $scope.clear = function () {
        $scope.inputDisplay = '';
    };

    //backspace
    $scope.backspace = function () {
        $scope.inputDisplay = $scope.inputDisplay.slice(0, -1);
    };

    //enter number
    $scope.number = function($event) {
        console.log($event.target.value);
        $scope.inputDisplay += $event.target.value;
        $scope.currentNumber += $event.target.value;
    };

    //ln
    $scope.lnFunc = function () {
        clearExpression();
        if ($scope.inputDisplay){
            $scope.ans = Math.log10(parseInt($scope.inputDisplay));
            $scope.expression += 'ln(' + $scope.inputDisplay + ')';
            $scope.clear();
        } else {
            $scope.ans = Math.log10($scope.ans);
        }
    };

    //log
    $scope.logFunc = function () {
        clearExpression();
        if ($scope.inputDisplay){
            $scope.ans = Math.log(parseInt($scope.inputDisplay));
            $scope.expression += 'log(' + $scope.inputDisplay + ')';
            $scope.clear();
        } else {
            $scope.ans = Math.log($scope.ans);
        }
    };

    //exp
    $scope.expFunc = function () {
        clearExpression();
        if ($scope.inputDisplay){
            $scope.ans = Math.exp(parseInt($scope.inputDisplay));
            $scope.expression += 'exp(' + $scope.inputDisplay + ')';
            $scope.clear();
        } else {
            $scope.ans = Math.exp($scope.ans);
        }
    };

    //10^x
    $scope.tenPow = function () {
        clearExpression();
        if ($scope.inputDisplay){
            $scope.ans = Math.pow(10, parseInt($scope.inputDisplay));
            $scope.expression += '10^' + $scope.inputDisplay;
            $scope.clear();
        } else if (!$scope.inputDisplay && $scope.ans) {
            $scope.ans = Math.pow(10, $scope.ans);
        }
    };

    //x^2
    $scope.twoFunc = function () {
        clearExpression();
        if ($scope.inputDisplay){
            $scope.ans = Math.pow(parseInt($scope.inputDisplay), 2);
            $scope.expression += $scope.inputDisplay + '^2';
            $scope.clear();
        } else if (!$scope.inputDisplay && $scope.ans) {
            $scope.ans = Math.pow($scope.ans, 2);
        } else if (!$scope.inputDisplay && $scope.ans == 0){
            $scope.ans = 0;
        }
    };

    //n!
    $scope.factorialFunc = function () {
        clearExpression();
        if ($scope.inputDisplay){
            var num = parseInt($scope.inputDisplay);
            // if (num === 0) {
            //     $scope.ans = 1;
            // } else {
            //     $scope.ans = num * $scope.factorialFunc( num - 1 );
            // }
        } else {
            var num = $scope.ans;
        }
        var rval=1;
        for (var i = 2; i <= num; i++)
            rval = rval * i;
        $scope.ans = rval;
        $scope.expression += $scope.inputDisplay + '!';
        $scope.clear();
    };

    //PI
    $scope.numberPi = function () {
        $scope.inputDisplay = Math.PI;
        $scope.expression += $scope.inputDisplay;
    };

    //%
    $scope.percent = function () {
        clearExpression();
        $scope.ans = parseFloat($scope.inputDisplay)/100;
        $scope.expresA += $scope.inputDisplay + '%';
        $scope.clear();
    };

    //1/x
    $scope.divisionX = function () {
        clearExpression();
        if ($scope.inputDisplay) {
            $scope.ans = 1 / parseFloat($scope.inputDisplay);
            $scope.expression += '1/' + $scope.inputDisplay;
            $scope.clear();
        } else if ($scope.ans) {
            $scope.ans = 1 / $scope.ans;
        } else {
            $scope.ans = 0;
        }
    };

    //sqrt(x)
    $scope.sqrtFunc = function () {
        clearExpression();
        if ($scope.inputDisplay) {
            $scope.ans = Math.sqrt(parseFloat($scope.inputDisplay));
            $scope.expression += 'sqrt(' + $scope.inputDisplay + ')';
            $scope.clear();
        } else if (!$scope.inputDisplay) {
            $scope.ans = Math.sqrt($scope.ans);
        } else if (!$scope.inputDisplay && $scope.ans == 0 && $scope.ans < 0) {
            $scope.ans = 0;
        }
    };

    //sin
    $scope.sinFunc = function () {
        clearExpression();
        if ($scope.inputDisplay) {
            $scope.ans = Math.sin(parseFloat($scope.inputDisplay));
            $scope.expression += 'sin(' + $scope.inputDisplay + ')';
            $scope.clear();
        } else if (!$scope.inputDisplay) {
            $scope.ans = Math.sin($scope.ans);
        }
    };

    //cos
    $scope.cosFunc = function () {
        clearExpression();
        if ($scope.inputDisplay) {
            $scope.ans = Math.cos(parseFloat($scope.inputDisplay));
            $scope.expression += 'cos(' + $scope.inputDisplay + ')';
            $scope.clear();
        } else if (!$scope.inputDisplay) {
            $scope.ans = Math.cos($scope.ans);
        }
    };

    //tan
    $scope.tanFunc = function () {
        clearExpression();
        if ($scope.inputDisplay) {
            $scope.ans = Math.tan(parseFloat($scope.inputDisplay));
            $scope.expression += 'tan(' + $scope.inputDisplay + ')';
            $scope.clear();
        } else if (!$scope.inputDisplay) {
            $scope.ans = Math.tan($scope.ans);
        }
    };

    //+
    $scope.addition = function ($event) {
        $scope.pendingValue = parseFloat($scope.inputDisplay);
        if($scope.pendingValue) {
            if($scope.ans && $scope.pendingOperation == "+" ) {
                $scope.ans += $scope.pendingValue;
                $scope.expression +=  '+' + $scope.pendingValue;
            } else if($scope.ans && $scope.pendingOperation == "-" ) {
                $scope.ans -= $scope.pendingValue;
                $scope.expression +=  '-' + $scope.pendingValue;
            }
            else {
                $scope.ans += $scope.pendingValue;
                $scope.expression += $scope.pendingValue + '+';
            }
        }
        $scope.pendingValue = null;
        $scope.pendingOperation = "+";
        $scope.clear();
    };

    //-
    $scope.subtraction = function ($event) {
        $scope.pendingValue = parseFloat($scope.inputDisplay);
        if($scope.pendingValue) {
            if($scope.ans && ($scope.pendingOperation == "-") ) {
                $scope.ans -= $scope.pendingValue;
                $scope.expression +=  '-' + $scope.pendingValue;
            } else if($scope.ans && $scope.pendingOperation == "+" ) {
                $scope.ans += $scope.pendingValue;
                $scope.expression +=  '+' + $scope.pendingValue;
            } else {
                $scope.ans -= $scope.pendingValue;
                $scope.expression +=  '-' + $scope.pendingValue;
            }
        }
        $scope.pendingValue = null;
        $scope.pendingOperation = "-";
        $scope.clear();
    };

    //*
    $scope.multiplication = function () {
        if ($scope.ans == 0) {
            $scope.ans = 1;
        }
        if (parseFloat($scope.inputDisplay)) {
            $scope.ans *= parseFloat($scope.inputDisplay);
            $scope.expression += $scope.inputDisplay + '*';
            $scope.pendingOperation = "*";
            $scope.clear();
        }
    };

    //   /
    $scope.division = function () {
        if (parseFloat($scope.inputDisplay) != 0 && parseFloat($scope.inputDisplay)) {
            $scope.ans /= parseFloat($scope.inputDisplay);
            $scope.pendingOperation = "/";
            $scope.expression += $scope.inputDisplay + '/';
            $scope.clear();
        } else if ($scope.ans == 0 && parseFloat($scope.inputDisplay) == 0) {
            $scope.ans = 0;
        }
    };

    //=
    $scope.answer = function () {
        $scope.pendingValue = parseFloat($scope.inputDisplay);
        if($scope.pendingOperation == "+") {
            $scope.ans += $scope.pendingValue;
        } else if($scope.pendingOperation == "-") {
            $scope.ans -= $scope.pendingValue;
        } else if($scope.pendingOperation == "*") {
            $scope.ans *= $scope.pendingValue;
        } else if($scope.pendingOperation == "/") {
            $scope.ans /= $scope.pendingValue;
        } else {
            $scope.ans = 0;
        }
        $scope.pendingOperation = null;
        $scope.pendingValue = null;
        $scope.clear();
    };

    function clearExpression() {
        $scope.expression = "";
    }
}

