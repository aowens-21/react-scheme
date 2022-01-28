import './App.css';
import Repl from './Repl/Repl.js';

export default function App() {
    return (
        <main className="app">
            <h1>React Scheme</h1>
            <section className="repl">
                <Repl />
            </section>
        </main>
    )
}