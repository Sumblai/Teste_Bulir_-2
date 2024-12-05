import React, { useState } from "react";
import { Button, Form, Input, message, Segmented, Spin, Card } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined, IdcardOutlined } from "@ant-design/icons";

const Register: React.FC = () => {
  const [userType, setUserType] = useState<string>("client"); 
  const [name, setName] = useState<string>("");
  const [nif, setNif] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
 
  const handleUserTypeChange = (value: string) => {
    setUserType(value);
  };

  
  const validateNif = (value: string) => {
    const nifRegex = /^[0-9]{9}$/;
    return nifRegex.test(value);
  };

  
  const handleSubmit = async () => {
    if (!name || !nif || !email || !password || !confirmPassword) {
      message.error("Por favor, preencha todos os campos.");
      return;
    }

    if (!validateNif(nif)) {
      message.error("O NIF deve conter exatamente 9 números.");
      return;
    }

    if (password !== confirmPassword) {
      message.error("As senhas não coincidem.");
      return;
    }

    setLoading(true); // Ativa o carregamento durante a requisição

    try {
      const response = await axios.post(
        "http://localhost:3000/app/bulir/register",
        {
          name,
          nif,
          email,
          password,
          role: userType === "client" ? "cliente" : "prestador",
        },
        { withCredentials: true }
      );
    
      if (response.status === 200) {
        message.success("Cadastro bem-sucedido!");
        navigate("/"); // Redireciona para a página de login após cadastro
      }
    } catch (error) {
      // Tipando o erro como AxiosError para acessar os dados específicos
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Ocorreu um erro ao tentar se cadastrar. Tente novamente.";
        
        console.error("Erro no cadastro:", errorMessage);
        message.error(`Falha no cadastro: ${errorMessage}`);
      } else {
      // Caso o erro não seja um erro do Axios, trata de outra forma
        console.error("Erro desconhecido:", error);
        message.error("Ocorreu um erro desconhecido.");
      }
    } finally {
      setLoading(false); // Desativa o carregamento após a requisição
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
        style={{ width: 400, padding: "30px", }}
        title={<h3 style={{ textAlign: "center" }}>Cadastro</h3>}
        bordered={false}
      >
        {/* Segmented com estilo de 50% de largura */}
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
            backgroundColor: "#fff",
          }}
        />

        <Form onFinish={handleSubmit}>
          <Form.Item
            label="Nome"
            name="name"
            rules={[{ required: true, message: "Por favor, insira seu nome!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              style={{
                borderRadius: "10px",
                padding: "10px",
                marginBottom: "15px",
              }}
            />
          </Form.Item>

          <Form.Item
            label="NIF"
            name="nif"
            rules={[{ required: true, message: "Por favor, insira seu NIF!" }]}
          >
            <Input
              prefix={<IdcardOutlined />}
              value={nif}
              onChange={(e) => setNif(e.target.value)}
              placeholder="Digite seu NIF (9 números)"
              style={{
                borderRadius: "10px",
                padding: "10px",
                marginBottom: "15px",
              }}
              maxLength={9}
            />
          </Form.Item>

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

          <Form.Item
            label="Confirmar Senha"
            name="confirmPassword"
            rules={[
              { required: true, message: "Por favor, confirme sua senha!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua senha"
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
                color:"#fff",
                fontSize: "16px",
                padding: "20px 10px",
                backgroundColor:"#9346e2"
              }}
            >
              {loading ? <Spin size="small" /> : "Cadastrar"}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          <p >
            Já tem uma conta? <a href="/" style={{color:"#9346e2"}}>Entrar</a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;
