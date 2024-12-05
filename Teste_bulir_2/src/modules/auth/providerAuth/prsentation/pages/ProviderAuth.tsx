import React, { useState } from "react";
import { Button, Form, Input, message, Segmented, Spin, Card } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { login } from "../../../../../app/providers/authSlice";
const Login: React.FC = () => {
  const [userType, setUserType] = useState<string>("client");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUserTypeChange = (value: string) => {
    setUserType(value);
  };


  const handleSubmit = async () => {
    if (!email || !password) {
      message.error("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true); 

    try {
      const response = await axios.post(
        "https://teste-para-a-a-vaga-de-desenvolvedor.onrender.com/app/bulir/login",
        { email, password, userType },
        { withCredentials: true } 
      );

      if (response.status === 200) {
        message.success("Login bem-sucedido!");

        const { token, user } = response.data;
        dispatch(login({ user, token }));

      
        if (response.data.user.role === "cliente") {
          navigate("/HomeClient"); 
        } else {
          navigate("/HomeProvider")
        }
      }
    } catch (error) {
      console.error("Erro no login:", error);
      message.error("Falha na autenticação. Verifique seus dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f0f2f5",
      }}
    >
    <Card
        style={{ width: 400, padding: "30px" }}
        title={<h3 style={{ textAlign: "center" }}> Seja bem-vindo!</h3>}
        bordered={false}
      >
        <Segmented
          value={userType}
          onChange={handleUserTypeChange}
          options={[
            { label: "Cliente", value: "client" },
            { label: "Provedor", value: "provider" },
          ]}
          style={{
            marginBottom: "20px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        />

        <Form onFinish={handleSubmit}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Por favor, insira seu email!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              style={{
                borderRadius: "10px",
                padding: "10px",
                marginBottom: "15px",
              }}
            />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[
              { required: true, message: "Por favor, insira sua senha!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              style={{
                borderRadius: "10px",
                padding: "10px",
                marginBottom: "15px",
              }}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <Button
            
              htmlType="submit"
              block
              loading={loading}
              style={{
                borderRadius: "10px",
                fontSize: "16px",
                padding: "20px 10px",
                backgroundColor:"#9346e2",
                color:"#fff"
              }}
            >
              {loading ? <Spin size="small" /> : "Entrar"}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          <p>
            Não tem uma conta? <a href="/signin" style={{color:"#9346e2"}}>Registrar-se</a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
