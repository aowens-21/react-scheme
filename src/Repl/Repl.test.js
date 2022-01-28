import { parseProgram } from "./Repl";
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
})