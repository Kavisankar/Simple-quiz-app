import React, { Component } from 'react';
import Spinner from '../../components/Spinner';
import { csv } from 'd3';
import CNS from './CNS.csv';
import PR from './PR.csv';
import SPM from './SPM.csv';
import ICDWA from './ICDWA.csv';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            error: null,
            testStatusCode: 0,
            questions: {},
            current: 0,
            mark: 0,
            showAnswer: false,
            viewOnlyAnswers: false
        };
        this.formRef = React.createRef();
    }

    _loadQuestions = async (option) => {
        this.setState({ isLoading: true });
        var questions = {};
        var QB;
        if(option === 1){
            QB = CNS;
        }
        else if(option === 2){
            QB = PR;
        }
        else if(option === 3){
            QB = SPM;
        }
        else{
            QB = ICDWA;
        }
        questions = await csv(QB);
        //console.log(questions);
        for( var i = questions.length-1; i > 0; i-- ){
            var j = Math.floor(Math.random() * (i + 1));
            var temp = questions[i];
            questions[i] = questions[j];
            questions[j] = temp;
        }
        this.setState({ isLoading: false, questions: questions, current: 0, testStatusCode: 1, mark: 0, showAnswer: false});
    }

    _next = () => {
        const curr = this.state.current + 1;
        if(!this.state.viewOnlyAnswers){
            var radios = this.formRef.current.elements['customRadio'];
            for (var i=0, len=radios.length; i<len; i++) {
                radios[i].checked = false;
            }
        }
        if(curr === this.state.questions.length){
            this.setState({ testStatusCode: 2 });
        }
        else{
            this.setState({ current: curr, showAnswer: false});
        }
    }

    _evaluate = () => {
        var val = 0;
        var radios = this.formRef.current.elements['customRadio'];
        for (var i=0, len=radios.length; i<len; i++) {
            if ( radios[i].checked ) {
                val = i + 1;
                break;
            }
        }
        
        if(val === parseInt(this.state.questions[this.state.current].Answer[0])){
            this.setState({ showAnswer: true, mark: this.state.mark + 1});
        }
        else{
            this.setState({ showAnswer: true });
        }
    }

    _getAnswer = (question) => {
        var ans = parseInt(question.Answer[0]);
        var res;
        if(ans === 1){
            res = question.A;
        }
        else if(ans === 2){
            res = question.B;
        }
        else if(ans === 3){
            res = question.C;
        }
        else{
            res = question.D;
        }
        if(question.Answer.length > 1){
            ans = parseInt(question.Answer[3]);
            res += ", \n and \n";
            if(ans === 1){
                res += question.A;
            }
            else if(ans === 2){
                res += question.B;
            }
            else if(ans === 3){
                res += question.C;
            }
            else{
                res += question.D;
            }
        }
        return res;
    }

    render() {
        if(this.state.error) {
            throw this.state.error;
        }
        if (this.state.isLoading) {
            return <Spinner />;
        }
        if (this.state.testStatusCode === 0){
            return (
                <div className="d-flex flex-column bg-myc h-100 justify-content-center align-items-center">
                    <div className="model-body rounded-lg ">
                        <header className="p-3 d-flex align-items-center justify-content-center flex-wrap rounded-top text-myc">
                            <i className="fas fa-laptop-code fa-2x mr-2 d-inline-block"></i>
                            <strong className="my-text-lg">Online Quiz Test</strong>
                            <i className="fas fa-user-graduate fa-2x ml-2 d-inline-block"></i>
                        </header>
                        <section className="p-3 pb-0">
                            <div className="d-flex justify-content-center mb-3">
                                <input type="checkbox" defaultChecked={this.state.viewOnlyAnswers } onChange={ () => { this.setState({viewOnlyAnswers: !this.state.viewOnlyAnswers}) }} />
                                <span className="pl-2">Check this to view only answers</span>
                            </div>
                            <div className="d-flex justify-content-center m-2">
                                <button type="button" className="btn my-btn px-3 mx-2 my-tab" onClick={this._loadQuestions.bind(this, 1)}>
                                    Cryptography and Network Security
                                </button>
                            </div>
                            <div className="d-flex justify-content-center m-2">
                                <button type="button" className="btn my-btn px-3 mx-2 my-tab" onClick={this._loadQuestions.bind(this, 2)}>
                                    Pattern Recognition
                                </button>
                            </div>
                            <div className="d-flex justify-content-center m-2">
                                <button type="button" className="btn my-btn px-3 mx-2 my-tab" onClick={this._loadQuestions.bind(this, 3)}>
                                    Software Project Management
                                </button>
                            </div>
                            <div className="d-flex justify-content-center m-2">
                                <button type="button" className="btn my-btn px-3 mx-2 my-tab" onClick={this._loadQuestions.bind(this, 4)}>
                                    Indian Constitution, Democracy And World Affairs
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            );
        }
        if (this.state.testStatusCode === 2){
            return (
                <div className="d-flex flex-column bg-myc h-100 justify-content-center align-items-center">
                    <div className="model-body rounded-lg ">
                        <header className="p-3 d-flex align-items-center justify-content-center flex-wrap rounded-top text-myc">
                            <strong className="my-text-lg">Your test score is {this.state.mark} / {this.state.questions.length}</strong>
                        </header>
                        <section className="p-3 pb-0 text-myc">
                            <div className="d-flex justify-content-center">
                                <button type="button" className="btn my-btn px-3 mx-2" onClick={ () => {this.setState({testStatusCode: 0})} }>
                                    <i className="fas fa-sign-in-alt mr-1"></i>
                                    <span className="text-bold">Click here to go home</span>
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            );
        }
        if(this.state.viewOnlyAnswers){
            return (
                <div className="d-flex flex-column bg-myc h-100 justify-content-center align-items-center">
                    <div className="model-body rounded-lg ">
                        <section className="p-3 pb-0 text-dark">
                            <strong>
                                <div className="my-3">{this.state.current + 1}) {this.state.questions[this.state.current].Question}</div>
                            </strong>
                            <div className="d-flex justify-content-center mt-3 text-center text-ws">Answer: <br />{this._getAnswer(this.state.questions[this.state.current])}</div>
                            <div className="d-flex justify-content-center mt-1">
                                <button type="button" className="btn my-btn px-3 mx-2" onClick={this._next.bind(this)} >
                                    <i className="fas fa-sign-in-alt mr-1"></i>
                                    <span className="text-bold">Next</span>
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            )
        }
        return (
            <div className="d-flex flex-column bg-myc h-100 justify-content-center align-items-center">
                <div className="score bg-white rounded-lg py-2 px-4">
                    Score: {this.state.mark} / {this.state.questions.length}
                </div>
                <div className="model-body rounded-lg ">
                    <section className="p-3 pb-0 text-dark">
                        <strong>
                            <div className="my-3">{this.state.current + 1}) {this.state.questions[this.state.current].Question}</div>
                        </strong>
                        <form ref={this.formRef}>
                            <div className="custom-control custom-radio ml-5 py-1">
                                <input type="radio" id="customRadio1" name="customRadio" className="custom-control-input" />
                                <label className="custom-control-label" htmlFor="customRadio1">1 - {this.state.questions[this.state.current].A}</label>
                            </div>
                            <div className="custom-control custom-radio ml-5 py-1">
                                <input type="radio" id="customRadio2" name="customRadio" className="custom-control-input" />
                                <label className="custom-control-label" htmlFor="customRadio2">2 - {this.state.questions[this.state.current].B}</label>
                            </div>
                            <div className="custom-control custom-radio ml-5 py-1">
                                <input type="radio" id="customRadio3" name="customRadio" className="custom-control-input" />
                                <label className="custom-control-label" htmlFor="customRadio3">3 - {this.state.questions[this.state.current].C}</label>
                            </div>
                            <div className="custom-control custom-radio ml-5 py-1">
                                <input type="radio" id="customRadio4" name="customRadio" className="custom-control-input" />
                                <label className="custom-control-label" htmlFor="customRadio4">4 - {this.state.questions[this.state.current].D}</label>
                            </div>
                        </form>
                        {
                            (this.state.showAnswer) ? (
                                <>
                                    <div className="d-flex justify-content-center mt-3">Correct answer: {this.state.questions[this.state.current].Answer}</div>
                                    <div className="d-flex justify-content-center mt-1">
                                        <button type="button" className="btn my-btn px-3 mx-2" onClick={this._next.bind(this)} >
                                            <i className="fas fa-sign-in-alt mr-1"></i>
                                            <span className="text-bold">Next</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="d-flex justify-content-center mt-3">
                                    <button type="button" className="btn my-btn px-3 mx-2" onClick={this._evaluate.bind(this)} >
                                        <i className="fas fa-sign-in-alt mr-1"></i>
                                        <span className="text-bold">Submit</span>
                                    </button>
                                </div>
                            )
                        }
                    </section>
                </div>
            </div>
        )
    }
}
