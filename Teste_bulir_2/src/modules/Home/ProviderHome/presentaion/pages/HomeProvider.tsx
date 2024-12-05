import  { useState } from "react";
import ServiceForm from "../components/ServiceForm";
import { ServiceList } from "../components/ServiceList";
import { ProviderHeader } from "../components/ProviderHeader";

interface ServiceType {
  key: string; 
  name: string;
  description: string;
  price: string;
  companyname: string; // Campo para nome da empresa
}

export const HomeProvider = () => {
  const [services, setServices] = useState<ServiceType[]>([]);

  const addService = (service: Omit<ServiceType, "key">) => {
    const newService = {
      ...service,
      key: (services.length + 1).toString(),
    };
    setServices((prevServices) => [...prevServices, newService]);
  };
  return (
    <div className="homeProvider">
      <ProviderHeader />
      <h2 style={{ marginTop: 60, marginLeft: 120,color:"#9346e2" }}>serviços</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 10,
          border: "1px solid #ccc",
          paddingLeft: 20,
          paddingTop: 20,
          width: "85%",
          marginLeft: 120,
          marginTop:40
        }}
        className="ServiceFormArea"
      >
        <div className="Title-And-Test" style={{marginLeft:35}}>
          <h3 style={{ marginTop: 15, fontWeight: 700, color:"#9346e2" }}>crie os seus serviços aqui 😊</h3>
          <p style={{ width: "90%", marginTop: 15, fontWeight:"100", fontSize:15, lineHeight:1.5 }}>
          Comece preenchendo o nome do serviço de forma clara e objetiva, garantindo que ele represente bem o que será oferecido aos clientes. No campo de descrição, adicione detalhes sobre os benefícios, como o que está incluído e como o serviço será realizado, para atrair mais interesse. Insira o preço no formato correto (somente números) e revise cuidadosamente todas as informações para evitar erros. Quando estiver satisfeito, clique no botão "Criar Serviço" para salvar seu serviço na plataforma e torná-lo disponível para os cliente
          </p>
        </div>

        <div className="ServiceForm" style={{ margin:"30px 30px"}}>
          <ServiceForm onAddService={addService} />
        </div>
      </div>

      <div
        style={{
          borderRadius: 10,
          border: "1px solid #ccc",
          paddingLeft: 20,
          paddingTop: 20,
          width: "85%",
          paddingRight:20,
          marginLeft: 120,
          marginTop: 50,
          backgroundColor: "#f8f9fb",
        }}
        className="ServicesList"
      >
        <ServiceList />
      </div>
    </div>
  );
};
