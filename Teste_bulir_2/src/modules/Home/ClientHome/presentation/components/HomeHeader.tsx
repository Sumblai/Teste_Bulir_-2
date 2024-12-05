import { useState, useEffect, useCallback } from "react";
import { DownOutlined, PlusOutlined , UserOutlined } from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Space,
  Modal,
  MenuProps,
  Input,
  message,
} from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../../../../../app/providers/authSlice";
import { useMediaQuery } from "react-responsive";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a target="_blank" rel="noopener noreferrer" href="/HomeClient">
        Serviços
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a target="_blank" rel="noopener noreferrer" href="/BookingList">
        Reservas
      </a>
    ),
  },
];

export const HomeHeader = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isAddBalanceModalVisible, setIsAddBalanceModalVisible] =
    useState(false);
  const [amountToAdd, setAmountToAdd] = useState<number | null>(null);
  const dispatch = useDispatch();

  ////Mobiles
  const IsIphone14ProMax = useMediaQuery({ maxWidth: 430 });
  
// Função para carregar o balance do localStorage
const loadBalance = useCallback(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    setBalance(user.balance);
    setName(user.name);
  }
}, []); // Não depende de nada, então as dependências estão vazias

// Função para observar mudanças no localStorage (mesma aba)
const observeLocalStorage = useCallback(() => {
  const originalSetItem = localStorage.setItem;

  localStorage.setItem = function (key, value) {
    originalSetItem.apply(this, [key, value]);
    if (key === "user") {
      loadBalance(); // Atualiza o balance
    }
  };
}, [loadBalance]); // Depende de loadBalance

useEffect(() => {
  // Carregar o balance inicialmente
  loadBalance();

  // Observar mudanças no localStorage
  observeLocalStorage();

  // Adicionar listener para o evento `storage` (outras abas)
  const handleStorageChange = () => {
    loadBalance();
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, [loadBalance, observeLocalStorage])

  // Função para exibir o modal de logout
  const showLogoutModal = () => {
    setIsLogoutModalVisible(true);
  };

  // Função para realizar o logout
  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  // Função para exibir o modal de adicionar balance
  const showAddBalanceModal = () => {
    setIsAddBalanceModalVisible(true);
  };

  // Função para adicionar balance
  const handleAddBalance = async () => {
    if (!amountToAdd || amountToAdd <= 0) {
      message.error("Insira um valor válido para adicionar ao balance.");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const clientId = user._id;
      try {
        await axios.put(
          "http://localhost:3000/app/bulir/updateBalance",
          {
            clientId,
            amount: amountToAdd,
          },
          { withCredentials: true }
        );
      
        // Atualizar o balance no localStorage e no estado
        const updatedBalance = balance! + amountToAdd;
        user.balance = updatedBalance;
        localStorage.setItem("user", JSON.stringify(user));
        setBalance(updatedBalance);
      
        message.success("Balance adicionado com sucesso!");
        setIsAddBalanceModalVisible(false);
        setAmountToAdd(null);
      } catch (error: unknown) {  // Usando 'unknown' como tipo para o erro
        // Verifica se o erro é do tipo AxiosError
        if (axios.isAxiosError(error)) {
          console.error("Erro ao adicionar balance:", error);
          message.error(
            error.response?.data?.message || "Erro ao adicionar balance"
          );
        } else {
          // Trata o erro desconhecido de maneira geral
          console.error("Erro desconhecido:", error);
          message.error("Erro desconhecido ao adicionar balance");
        }
      }


    }
  };

  return (
    <div
      className="ProviderHeader"
      style={{
        width: IsIphone14ProMax ? "60vh" : "100%",
        backgroundColor: "#9346e2",
        padding: "20px 0px",
        display: "flex",
      }}
    >
      {!IsIphone14ProMax && (
        <p
          style={{
            color: "#fff",
            marginLeft: 30,
            fontSize: 23,
            marginTop: 10,
            fontWeight: "bold",
          }}
        >
          LOGO
        </p>
      )}

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
        className="BottomAndInfo"
      >
        <div style={{ color: "#fff", marginLeft: IsIphone14ProMax ? 10 : 50 }}>
          <Space direction="vertical">
            <Space wrap>
              <Dropdown menu={{ items }} placement="bottom">
                <Button
                  style={{
                    width: IsIphone14ProMax ? 80 : 200,
                    height: IsIphone14ProMax ? 30 : 40,
                    fontSize: IsIphone14ProMax ? 11 : 15,
                    border: "2px solid #fff",
                    backgroundColor: "#9346e2",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Menu <DownOutlined />
                </Button>
              </Dropdown>
            </Space>
          </Space>
        </div>

        <div
          style={{
            color: "#fff",
            fontSize: 20,
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <p style={{ fontSize: IsIphone14ProMax ? 11 : 16 }}>
            Balance: {balance !== null ? `${balance} KZ` : "Carregando..."}
          </p>
          <PlusOutlined
            style={{ cursor: "pointer" }}
            onClick={showAddBalanceModal}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginRight: 20,
          }}
        >
          <p style={{ color: "#fff", fontSize: 18, margin: 0 }}>{name}</p>
          <div
            style={{
              background: "#fff",
              borderRadius: 50,
              border: "4px solid pink",
              width: 30,
              height: 30,
              display:"flex",
              alignItems:"center",
              justifyContent:"center"
            }}
          ><UserOutlined /></div>
          <DownOutlined
            style={{ color: "#fff", fontSize: 20, cursor: "pointer" }}
            onClick={showLogoutModal}
          />
        </div>
      </div>

      {/* Modal de Logout */}
      <Modal
        title="Confirmar Logout"
        visible={isLogoutModalVisible}
        onOk={handleLogout}
        onCancel={() => setIsLogoutModalVisible(false)}
        okText="Sair"
        cancelText="Cancelar"
      >
        <p>Tem certeza que deseja sair?</p>
      </Modal>

      {/* Modal de adicionar balance */}
      <Modal
        title="Adicionar Balance"
        visible={isAddBalanceModalVisible}
        onOk={handleAddBalance}
        onCancel={() => setIsAddBalanceModalVisible(false)}
        okText="Adicionar"
        cancelText="Cancelar"
      >
        <Input
          type="number"
          placeholder="Insira o valor"
          value={amountToAdd || ""}
          onChange={(e) => setAmountToAdd(Number(e.target.value))}
        />
      </Modal>
    </div>
  );
};
