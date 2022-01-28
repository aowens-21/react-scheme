import React from "react";

export default class Repl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            programText: ''
        }

        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(event) {
        this.setState({ programText: event.target.value });
        console.log(this.state.programText);
    }

    render() {
        return (
            <input 
                type="text" 
                className="replInput" 
                placeholder="Enter Scheme Code Here"
                value={this.state.programText}
                onChange={this.handleInput}
            />
        )
    }
}

function parseProgram(programText) {
    
}