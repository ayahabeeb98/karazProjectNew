import React from 'react';
import {ValidatePassword} from "../../components/Functionality";
import axios from 'axios';
import {Form, FormGroup} from 'reactstrap';
import Input from "reactstrap/es/Input";

export default class ResetPassword extends React.Component {

    constructor() {
        super();
        this.state = {
            password: '',
            confirmPassword: '',
            id: '',
            code: '',
            errors: {},
            loading:false,
            togglePassword: true
        }
    }

    componentWillMount() {
        if (this.props.location.state === undefined) {
            this.props.history.push('/login')
        } else {
            this.setState({
                id: this.props.location.state.id,
                code: this.props.location.state.code
            })
        }
    }

    checkPassword = () => {
        let {password} = this.state;
        const passwordLength = document.getElementById("passwordLength");
        const passwordLetter = document.getElementById("letters");
        const passwordNumber = document.getElementById("numbers");
        const passwordSymbols = document.getElementById("symbols");

        let c1 = ValidatePassword(password.length < 6, passwordLength, password);
        let c2 = ValidatePassword(!password.match(/[a-zA-z]+/), passwordLetter, password);
        let c3 = ValidatePassword(!password.match(/\d/), passwordNumber, password);
        let c4 = ValidatePassword(!password.match(/[!@#$%^&*]/), passwordSymbols, password);

        return c1 & c2 & c3 & c4;
    };


    //reset the password condition to the initial state
    resetPassword = () => {
        const allCondition = document.getElementsByClassName("c");
        if (this.state.password.length === 0) {
            let a = Array.from(allCondition);
            a.map(e => {
                return (
                    e.classList.remove("failed"),
                        e.classList.remove("success"))
            })
        }

    };


    handleToggle = () => {
        this.setState({
            togglePassword: !this.state.togglePassword
        })
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const {id, code, password, confirmPassword, errors} = this.state;
        const changedPassword = {
            id: id,
            random: code,
            password,
            passwordConfirm: confirmPassword
        };

        if (password !== confirmPassword) {
            errors["notMatch"] = "كلمتا المرور غير متطابقتين";
            this.setState(errors);
        } else {
            axios.post('https://karaz6.herokuapp.com/api/forgetPassword/changePassword', changedPassword)
                .then(response => {
                    this.props.history.push('/login');
                })
                .catch(error => {
                    errors["serverError"] = "يُرجى التأكد من البيانات المدخلة والمحاولة مجددًا.";
                    this.setState({loading: false, errors});
                })
        }
    };


    render() {

        //Apply the validation when the user start typing
        this.checkPassword();
        this.resetPassword();
        const {password, confirmPassword, togglePassword,loading, errors} = this.state;

        return (
            <>
                <p className="headerText mt-3">تأكيد الحساب</p>
                <p className="subHeader">إنشاء كلمة مرور جديدة</p>
                <p className="description">
                    أنت سوف تستخدم كلمة المرور للوصول إلي حسابك
                </p>

                <div className="choices mt-4">
                    {/* MessageError */}
                    {errors["serverError"] ?
                        <div className="alert alert-danger px-1" role="alert">
                                <span className="errorMsg text-right text-danger">
                                    {errors["serverError"]}</span>
                        </div> : null}

                    {errors["notMatch"] ?
                        <div className="alert alert-danger px-1" role="alert">
                                <span className="errorMsg text-right text-danger">
                                    {errors["notMatch"]}</span>
                        </div> : null}

                    <Form className="mainForm" onSubmit={this.handleSubmit}>
                        <FormGroup className="custom-form-group">
                            <Input type={togglePassword ? "password" : "text"}
                                   placeholder="كلمة المرور" className="form-control custom-input"
                                   name="password" value={password} onChange={this.handleChange}
                            />

                            {password.length !== 0 ? [
                                <span className="topLabel full" key="1"> كلمة المرور</span>,
                                <span className="clearPassword" key="2"
                                      onClick={() => this.setState({"password": ''})}>
                                    <i className="fa fa-times-circle"></i>
                                    </span>,
                                <span className="togglePassword" key="3" onClick={this.handleToggle}
                                    style={{top:"20%"}}
                                >
                                    {togglePassword ? "إظهار" : "إخفاء"}
                        </span>
                            ] : null}
                        </FormGroup>

                        <FormGroup className="custom-form-group">
                            <input type={togglePassword ? "password" : "text"}
                                   placeholder="تأكيد كلمة المرور" className="form-control custom-input"
                                   name="confirmPassword" value={confirmPassword} onChange={this.handleChange}
                            />

                            {confirmPassword.length !== 0 ? [
                                <span className="topLabel full" key="1"> كلمة المرور</span>,
                                <span className="clearPassword" key="2" style={{top:"5%"}}
                                      onClick={() => this.setState({"password": ''})}>
                                    <i className="fa fa-times-circle"></i>
                                    </span>,
                                <span className="togglePassword" key="3" onClick={this.handleToggle}>
                                    {togglePassword ? "إظهار" : "إخفاء"}
                        </span>
                            ] : null}

                            <ul className="text-right mr-4 conditions" dir="rtl">
                                <li id="passwordLength" className="c">تحتوي علي 6 أحرف على الأقل</li>
                                <li id="letters" className="c">تحتوي ع أحرف صغيرة أو أحرف كبيرة</li>
                                <li id="numbers" className="c">تحتوي على رقم واحد على الأقل</li>
                                <li id="symbols" className="c">تحتوي على رمز واحد على الأقل</li>
                            </ul>
                        </FormGroup>

                        <button type="submit" className="btn btn-custom btn-notActive"
                                disabled={password && confirmPassword && this.checkPassword()&& !loading ? false : "disabled"}>
                            {loading ? <i className="fa fa-spinner loadingIcon"></i> : "تغيير كلمة المرور"}

                        </button>

                    </Form>

                </div>
            </>
        )
    }
}