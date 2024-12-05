import React from "react";

export default function ClientSearc() {
  return (
    <>
      <div style={{ display: "flex" }} className="SearchContainer">
        <input
          style={{
            width: "80%",
            height: 100,
            marginTop: 50,
            paddingLeft: 20,
            marginLeft: 100,
            borderRadius: 5,
            border: "2px solid #9346e2",
            outline: "none",
            fontSize: 20,
          }}
          type="text"
          placeholder="digite por serviços"
        />
      </div>
    </>
  );
}
