import React, { useState, useEffect } from "react";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Modal, MenuProps } from "antd";
import { useMediaQuery } from "react-responsive";
import { useDispatch } from "react-redux";
import { logout } from "../../../../../app/providers/authSlice";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a target="_blank" rel="noopener noreferrer" href="/HomeProvider">
        serviços
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="/BookingHistoryProvider"
      >
        Historico de reservas
      </a>
    ),
  },
];

export const ProviderHeader = () => {
  const [name, setName] = useState<string | null>(null);
  const [ServiceConunt, setServiceConunt] = useState<string | null>(null);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false); 
  const IsIphone14ProMax = useMediaQuery({ maxWidth: 430 });
  const dispatch = useDispatch();

  const loadBalance = () => {

    const storedUser = localStorage.getItem("user") ?? '{}'; 
    const StoreServicesCount = localStorage.getItem("serviceCount") ?? '0';
    if (storedUser || StoreServicesCount) {
      const user = JSON.parse(storedUser);
      setName(user.name);
      const counter = JSON.parse(StoreServicesCount);
      setServiceConunt(counter);
    }
  };

  const observeLocalStorage = () => {
    const originalSetItem = localStorage.setItem;

    localStorage.setItem = function (key, value) {
      originalSetItem.apply(this, [key, value]);
      if (key === "user") {
        loadBalance(); // Atualiza o balance
      }
    };
  };

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

    // Limpar o listener quando o componente for desmontado
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Função para exibir o modal de logout
  const showLogoutModal = () => {
    setIsLogoutModalVisible(true);
  };

  // Função para realizar o logout
  const handleLogout = () => {
    dispatch(logout()); // Ação para limpar o estado de autenticação
    window.location.href = "/"; // Redirecionar para a página de login
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
        <div style={{ color: "#fff", marginLeft: 50 }}>
          <Space direction="vertical">
            <Space wrap>
              <Dropdown menu={{ items }} placement="bottom">
                <Button
                  style={{
                    width: 200,
                    height: 40,
                    fontSize: 15,
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

        <div style={{ color: "#fff", fontSize: 20, marginTop: 10 }}>
          <p>serviços criados : {ServiceConunt}</p>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 18,
            gap: 18,
            marginTop: 10,
          }}
        >
          <p style={{ color: "#fff", marginTop: 8, fontSize: 20 }}>{name}</p>
          <div
            style={{
              background: "#fff",
              borderRadius: 50,
              border: "4px solid pink",
              width: 30,
              height: 30,

              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <UserOutlined />
          </div>
          <DownOutlined
            style={{
              color: "#fff",
              fontSize: 20,
              cursor: "pointer",
              marginRight: 15,
            }}
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
    </div>
  );
};
