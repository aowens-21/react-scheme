import { parseProgram, interp } from "./Repl";
import { ExprType } from './Language';

test('parse addition', ()=> {
    const p = '     (+ 2 2)  ';
    const parsed = parseProgram(p);

    expect(parsed.type === ExprType.Add);
    expect(parsed.expr1.ExprType === ExprType.Num);
    expect(parsed.expr1.value === 2);
    expect(parsed.expr2.ExprType === ExprType.Num);
    expect(parsed.expr2.value === 2);
});

test('parse subtraction', ()=> {
    const p = '     (- 3 1)  ';
    const parsed = parseProgram(p);

    expect(parsed.type === ExprType.Add);
    expect(parsed.expr1.ExprType === ExprType.Num);
    expect(parsed.expr1.value === 3);
    expect(parsed.expr2.ExprType === ExprType.Num);
    expect(parsed.expr2.value === 1);
});

test('parse nested addition', ()=> {
    const p = '     (+ 2 (+ 1 5))  ';
    const parsed = parseProgram(p);

    expect(parsed.type === ExprType.Add);
    expect(parsed.expr1.ExprType === ExprType.Num);
    expect(parsed.expr1.value === 2);
    expect(parsed.expr2.ExprType === ExprType.Add);

    const rhs = parsed.expr2;
    expect(rhs.expr1.type === ExprType.Num && rhs.expr1.value === 1);
    expect(rhs.expr2.type === ExprType.Num && rhs.expr2.value === 5);
});

test('parse a single number', ()=> {
    const p = '5';
    const parsed = parseProgram(p);

    expect(parsed.type === ExprType.Num && parsed.value === 5);
});

test('throw an error when given an incomplete expression', ()=> {
    expect(()=> {
        parseProgram('  (+ ) ');
    }).toThrow();
});

test('interpret a number', ()=> {
    const program = parseProgram('    5     \n');
    expect(interp(program) === 5);
});

test('interpret simple addition', ()=> {
    const program = parseProgram('(+ 1 2)');
    expect(interp(program) === 3);
});

test('interpret simple subtraction', ()=> {
    const program = parseProgram('(- 15 2)');
    expect(interp(program) === 13);
});

test('interpret nested arithmetic operations', ()=> {
    const program = parseProgram('(+ (+ 1 2) (- 2 4))');
    expect(interp(program) === 1);
});

test ('error when giving wrong arity to add', ()=> {
    expect(()=> {
        const program = parseProgram('(+ 1)');
    }).toThrow();
});

test('interpret a multiplication', ()=> {
    const program = parseProgram('(* 2 6)');
    expect(interp(program) === 12);
});

test('parse a symbol', ()=> {
    const p = parseProgram('\'10');
    expect(p === {
        type: ExprType.Symbol,
        value: '\'10'
    });
});

test('interpret a symbol', ()=> {
    const p = parseProgram('\'hello');
    expect(interp(p) === '\'hello');
});

test('intepret a let expression', ()=> {
    const p = parseProgram('(let ((x 5)) (* x x))');
    expect(interp(p) === 25);
});

test('interpet let with multiple ids', ()=> {
    const p = parseProgram('(let ((x 5) (y 10)) (+ x y))');
    expect(interp(p) === 15);
});