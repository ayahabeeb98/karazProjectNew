import React, {useContext} from 'react';
import {facebbok, gmail} from "../img/img";
import ToggleField from "./ToggleField";
import {UserInfoContext} from "../context/UserInfoContext";
import {Validator} from "./Validator";
import axios from 'axios';

export default function StepTwo(props) {

    const state = useContext(UserInfoContext);

    //Handle Change value and update the state
    const handleChange = e => {
        state.updateInfo(e.target.name, e.target.value);
    };

    //Toggle between email and phone
    const handleToggleClick = () => {
        state.handleToggle("toggleField");
    };

    //Clear Field
    const clearField = (attr) => {
        state.updateInfo(attr, '');
    };

    //Validate the form before submit
    const validateForm = () => {
        const {name, email, phone, errors} = state;
        let validEmail = false;
        let validPhone = false;
        let validName = Validator("name", name,
            /^[a-zA-Z\u0600-\u06FF]+$/, errors, "الاسم يتكون من أحرف عربية أو انجليزية فقط");

        if (name.length < 3) {
            validName = false;
            errors["name"] = "الاسم الذي أدخلته قصير للغاية"
        }

        if (email.length !== 0) {
            validEmail = Validator("email", email,
                /[^\d][\w.]+@\w+(\.[A-Za-z]+){1,2}/g, errors, "البريد الالكتروني الذي أدخلته غير صحيح");
        }

        if (phone.length !== 0) {
            validPhone = Validator("phone", phone
                , /[0-9]{10}/, errors, "رقم الهاتف الذي أدخلته غير صحيح");
        }

        state.handleError(errors);
        return validName && (validEmail || validPhone);

    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const {name, email, phone, errors} = state;
        const user = {name};
        if (email.length !== 0) {
            user.email = email
        } else {
            user.phone = phone;
        }

        if (validateForm()) {
            axios.post('http://karaz5.herokuapp.com/api/user/findUser', user)
                .then(response => {
                    if (response.status === 200) {
                        props.history.push('/signup/stepTwo');
                    }
                })
                .catch(error => {
                        if (phone.length !== 0) {
                            errors["serverError"] = "رقم الهاتف الذي أدخلته مستخدم في حساب آخر";
                        } else {
                            errors["serverError"] = "البريد الإلكتروني الذي أدخلته مستخدم في حساب آخر";
                        }
                        state.handleError(errors);

                    }
                );

            state.updateCompleted();
        }
    };

    return (

        <div className="choices mb-4 mt-2">

            <p className="headerText noselect">إنشاء حساب بواسطة</p>

            <div className="apps">

                <a href="https://karaz12.herokuapp.com/auth/facebook" className="btn LoginApp text-secondary">
                    <img src={facebbok} alt="facebook"/>
                    <span className="social">Facebook</span>
                </a>
                <a href="http://karaz5.herokuapp.com/api/user/google" className="btn LoginApp text-secondary">
                    <img src={gmail} alt="gmail"/>
                    <span className="social">Google</span>
                </a>

            </div>

            <span className='or noselect'>أو</span>


            {/***** Signup form *****/}

            {state.errors["serverError"] ?
                <div className="alert alert-danger" role="alert">
                            <span className="errorMsg text-right text-danger">
                                {state.errors["serverError"]}</span>
                </div> : null}

            <form action="" className="mainForm" onSubmit={handleSubmit}>

                <div className="form-group custom-form-group">
                    <input type="text" placeholder="الإسم" className="form-control custom-input"
                           name="name" id="name" onChange={handleChange} value={state.name}
                    />
                    {state.name.length !== 0 ?
                        [
                            <span className="topLabel full" key="name">الإسم</span>,
                            <span className="clear" key="clear" onClick={() => clearField("name")}>
                            <i className="fas fa-times-circle"></i>
                            </span>
                        ]
                        : null}

                    <span className="errorMsg">{state.errors["name"]}</span>

                </div>

                {state.toggleField ?

                    <ToggleField type="text" name="phone" id="phone" placeholder="رقم الهاتف"
                                 child={state.errors["phone"]}
                                 onChange={handleChange} value={state.phone} onClick={handleToggleClick}
                    >
                        استخدام البريد الإلكتروني بدلًا من ذلك
                    </ToggleField>
                    :

                    <ToggleField type="email" name="email" id="email" placeholder="البريد الإلكتروني"
                                 child={state.errors["email"]}
                                 onChange={handleChange} value={state.email} onClick={handleToggleClick}
                    >
                        استخدام رقم الهاتف بدلًا من ذلك
                    </ToggleField>
                }

                <button type="submit" className="btn btn-custom btn-notActive mb-0"
                        id="next" disabled={state.name && (state.email || state.phone) ? false : "disabled"}>التالي
                </button>

            </form>
        </div>
    )
}