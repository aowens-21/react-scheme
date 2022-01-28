import React from "react";
import { ExprType } from "./Language";

export default class Repl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            programText: ''
        }

        this.handleInput = this.handleInput.bind(this);
        this.evalProgram = this.evalProgram.bind(this);
    }

    evalProgram() {
        const text = this.state.programText;
        const parsed = parseProgram(text);
        console.log(interp(parsed));
    }

    handleInput(event) {
        this.setState({ programText: event.target.value });
    }

    render() {
        return (
            <input 
                type="text" 
                className="replInput" 
                placeholder="Enter Scheme Code Here"
                value={this.state.programText}
                onChange={this.handleInput}
                onKeyPress={this.evalProgram}
            />
        )
    }
}

export function parseProgram(programText) {
    const trimmedProgram = programText.trim();
    
    // find the first non-whitespace char
    while (trimmedProgram !== '' && 
           (trimmedProgram[0] === '\n' 
            || trimmedProgram[0] === ' ' 
            || trimmedProgram[0] === '\t')) {
        trimmedProgram = trimmedProgram.substring(1);
    }

    if (trimmedProgram[0] === '(') {
        let unparsedSubExprs = [];
        let currentSubExpr = '';
        let i = 1;
        while (i < trimmedProgram.length) {
            if (trimmedProgram[i] === '(') {
                const closingParenPos = findMatchingParen(i, trimmedProgram);
                
                if (closingParenPos) {
                    unparsedSubExprs.push(trimmedProgram.substring(i, closingParenPos + 1));
                    currentSubExpr = '';
                    i = closingParenPos + 1;
                } else {
                    throw new Error('Unbalanced parens!');
                }
            } else if (trimmedProgram[i] !== ' ' && trimmedProgram[i] !== '\n' && trimmedProgram[i] !== '\t') {
                currentSubExpr += trimmedProgram[i];
                i++;
            } else {
                unparsedSubExprs.push(currentSubExpr);
                currentSubExpr = '';
                i++;
            }
        }
        
        unparsedSubExprs.push(currentSubExpr.substring(0, currentSubExpr.length - 1));
        unparsedSubExprs = unparsedSubExprs.filter((e)=> {
            return e !== '';
        });
        
        switch (unparsedSubExprs[0]) {
            case '+':
                return {
                    type: ExprType.Add,
                    expr1: parseProgram(unparsedSubExprs[1]),
                    expr2: parseProgram(unparsedSubExprs[2])
                };
            case '-':
                return {
                    type: ExprType.Sub,
                    expr1: parseProgram(unparsedSubExprs[1]),
                    expr2: parseProgram(unparsedSubExprs[2])
                };
            default:
                throw new Error("Operation not supported: " + unparsedSubExprs[0]);
        }

    } else {
        const pAsNumber = parseInt(trimmedProgram);

        if (!isNaN(pAsNumber)) {
            return {
                type: ExprType.Num,
                value: pAsNumber
            };
        }

        throw new Error('Invalid program: ' + trimmedProgram);
    }   
}

function findMatchingParen(openPos, str) {
    let extras = 0;

    for (let i = openPos + 1; i < str.length; i++) {
        if (str[i] === ')' && extras === 0) {
            return i;
        } else if (str[i] === ')') {
            extras--;
        } else if (str[i] === '(') {
            extras++;
        }
    }

    return false;
}

function interp(program) {
    
}