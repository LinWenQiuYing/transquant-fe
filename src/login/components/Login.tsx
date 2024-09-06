import {
  clsPrefix,
  COOKIE_PASSWORD,
  COOKIE_USERNAME,
  IMAGE_INSTANCE,
  INIT_CODE,
  paths,
  REMEMBER_PASSWORD,
  USER_TOKEN,
} from "@transquant/constants";
import { PswModify } from "@transquant/person";
import { decrypt, encrypt, ls, useCookieState } from "@transquant/utils";
import { useMount } from "ahooks";
import { Button, Checkbox, Form, Input, message } from "antd";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useStores } from "../hooks";
import "./index.less";

const LoginView: React.FC<unknown> = () => {
  const { t } = useTranslation();
  const { loginStore } = useStores();
  const { login, getToken } = loginStore;
  const [captchaUrl, setCaptchaUrl] = useState("");
  const navigate = useNavigate();
  const [helpMessage, setHelpMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [cookieUsername, setCookieUsername] = useCookieState(COOKIE_USERNAME, {
    expires: 7,
  });
  const [cookiePassword, setCookiePassword] = useCookieState(COOKIE_PASSWORD, {
    expires: 7,
  });

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({
    password: "",
    remember: ls.getItem(REMEMBER_PASSWORD) || false,
    username: "",
    verifyCode: "",
  });

  const getCaptchaUrl = (url: string) => {
    return `${url}&timestamp=${new Date().getTime()}`;
  };

  // 获取验证码
  const onCaptchaChange = () => {
    getToken().then((data: any) => {
      let token = ls.getItem(USER_TOKEN);

      if (typeof data === "string") {
        token = data;
      }
      const uri = "tquser/user/getVerifyCode";

      const url = getCaptchaUrl(`${uri}?token=${token}`);

      setCaptchaUrl(url);
    });
  };

  useMount(() => {
    onCaptchaChange();

    if (formValues.remember) {
      const values = {
        ...formValues,
        ...{
          username: decrypt(cookieUsername || ""),
          password: decrypt(cookiePassword || ""),
        },
      };
      form.setFieldsValue(values);
      setFormValues(values);
    }
    ls.removeItem(IMAGE_INSTANCE);
  });

  const remember = () => {
    setCookieUsername(encrypt(formValues.username));
    setCookiePassword(encrypt(formValues.password));
  };

  const onFinish = async (values: any) => {
    await login(values)
      .then((data) => {
        if (data?.code === INIT_CODE) {
          setVisible(true);
          message.info(data.message);
          return;
        }
        // navigate(paths.env);
        navigate(paths.home);
      })
      .catch((error) => {
        setHelpMessage(error.message);
      });

    if (formValues.remember) {
      remember();
    }
  };

  const onFormValueChange = (value: any) => {
    const [key] = Object.keys(value);

    if (key === "remember") {
      ls.setItem(REMEMBER_PASSWORD, value[key]);
    }

    setFormValues({ ...formValues, ...value });
  };

  return (
    <div className="w-full h-full overflow-hidden bg-gray-950">
      <div className={`${clsPrefix}-login-stars`}>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} />
        ))}
      </div>
      <div
        className={`${clsPrefix}-login-container absolute z-10 flex justify-between -translate-x-1/2 -translate-y-1/2 shadow top-1/2 left-1/2 rounded-xl bg-gray-100`}
      >
        <div />
        <div className="flex flex-col w-[440px] ml-[-1px] px-[72px] py-[60px] bg-gray-100">
          <span className="inline-block mt-5 mb-5 text-lg font-semibold">
            {t("login.welcome")}
          </span>
          <Form
            name="login"
            autoComplete="off"
            requiredMark={false}
            onFinish={onFinish}
            layout="vertical"
            form={form}
            initialValues={formValues}
            onValuesChange={onFormValueChange}
          >
            <Form.Item
              name="username"
              label={t("login.username.value")}
              rules={[
                {
                  required: true,
                  message: t("login.username.placeholder"),
                },
              ]}
            >
              <Input
                placeholder={t("login.username.placeholder")}
                autoComplete={formValues.remember ? "on" : "off"}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label={t("login.password.value")}
              rules={[
                {
                  required: true,
                  message: t("login.password.placeholder"),
                },
              ]}
            >
              <Input.Password
                placeholder={t("login.password.placeholder")}
                autoComplete={formValues.remember ? "on" : "off"}
              />
            </Form.Item>
            <Form.Item
              name="verifyCode"
              label={t("login.captcha.value")}
              rules={[
                {
                  required: true,
                  message: t("login.captcha.placeholder"),
                },
              ]}
              {...(helpMessage && {
                validateStatus: "error",
                help: helpMessage,
              })}
            >
              <div className="flex">
                <Input placeholder={t("login.captcha.placeholder")} />
                <img
                  onClick={onCaptchaChange}
                  id="captcha"
                  alt=" "
                  className="ml-2.5"
                  src={captchaUrl}
                />
              </div>
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>{t("login.rememberPassword")}</Checkbox>
            </Form.Item>
            <Form.Item style={{ marginTop: "-10px" }}>
              <Button type="primary" htmlType="submit" className="w-full mt-5">
                {t("login.login")}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <PswModify
        visible={visible}
        onVisibleChange={(value) => setVisible(value)}
      />
    </div>
  );
};

export default observer(LoginView);
