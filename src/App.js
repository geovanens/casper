import React from "react";
import "./App.css";
import Modal from "./Modal";
import ModalEdit from "./ModalEdit";
import { Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: "load",
      notices: [],
      themes: {
        sports: "Esportes",
        policy: "Política",
        entertainment: "Entretenimento",
        famous: "Famosos"
      },
      editData: {},
      readOnly: true
    };
  }

  componentDidMount() {
    const MYPIN = process.env.REACT_APP_MYPIN;
    const PIN = localStorage.getItem("adminPIN");
    const { readOnly } = this.state
    console.log(MYPIN);
    console.log(PIN);
    const equalsPINS = MYPIN === PIN;
    this.setState({ readOnly: !equalsPINS });
    console.log("MODE READONLY ", !equalsPINS);
    const data = {
      limit: { limit: 0 }
    };
    axios.post("https://api-webhook.glitch.me/getnotices", data).then(res => {
      const notices = res.data;
      console.log("DATA GET ", notices);
      this.setState({ notices });
      this.setState({ show: "main" });
    });

  }

  handleSubmit(e) {
    e.preventDefault();
    const PIN = e.target.elements.pin.value;
    localStorage.setItem("adminPIN", PIN);
    window.location.reload();
  }

  handleLogout() {
    localStorage.removeItem("adminPIN");
    window.location.reload();
  }

  showModal(e) {
    const eventName = e;
    console.log("SHOW MODAL", e);
    console.log(eventName);
    if (eventName === "add") {
      this.setState({ show: "add" });
    } else if (eventName === "edit") {
      this.setState({ show: "edit" });
    } else {
      this.setState({ show: "main" });
    }
  }

  updateEditData(data) {
    this.setState({ editData: data });
  }

  async editar(e) {
    const { readOnly } = this.state;
    if (!readOnly) {
      console.log("EDITANDO", e);
      console.log("ID", e.target.id);
      const { notices } = this.state;
      const data = notices.filter(f => f._id === e.target.id)[0];
      console.log(data);
      this.updateEditData(data);
      this.showModal("edit")
    }
  }

  excluir(e) {
    const { readOnly } = this.state;
    if (!readOnly) {
      const id = e.target.id;
      const data = {
        data: {
          id: id
        }
      };
      console.log("DELETANDO", data);
      axios
        .delete("https://api-webhook.glitch.me/notices", data)
        .then(res => {
          console.log(res);
          window.location.reload();
        })
        .catch(error => {
          alert("Data could not be removed." + error);
          console.log(error);
        });
    }

  }

  render() {
    const PIN = localStorage.getItem("adminPIN");
    const { notices, show, themes, readOnly } = this.state;
    if (PIN !== null) {
      if (show === "main") {
        return (
          <div className="App">
            <div className="header">
              <div className="title">
                <h2>Welcome to Casper Admin</h2>
              </div>
            </div>
            <div className="wrapper">
              <table border="1" id="notices">
                <thead>
                  <tr>
                    <td>Link para Imagem</td>
                    <td>Título</td>
                    <td>Descrição</td>
                    <td>Tema</td>
                    <td>Link</td>
                    <td>Editar</td>
                    <td>Apagar</td>
                  </tr>
                </thead>
                <tbody>
                  {notices.map(e => (
                    <tr id={e.id}>
                      <td>
                        <p>{e.image_link}</p>
                      </td>
                      <td>
                        <p>{e.title}</p>
                      </td>
                      <td>
                        <p>{e.description}</p>
                      </td>
                      <td>
                        <p>{themes[e.theme]}</p>
                      </td>
                      <td>
                        <p>{e.link}</p>
                      </td>
                      <td
                        id={e._id}
                        onClick={e => this.editar(e)}
                        disabled={readOnly}
                        acao="edit"
                      >
                        <Icon name='pencil alternate'
                          id={e._id}
                          disabled={readOnly}
                          acao="edit"
                        />
                      </td>
                      <td type="icon"
                        name="delete"
                        id={e._id}
                        onClick={e => this.excluir(e)}
                        disabled={readOnly}>
                        <Icon
                          name='trash alternate'
                          id={e._id}
                          disabled={readOnly}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <button
                  type="button"
                  name="add"
                  onClick={e => {
                    this.showModal("add");
                  }}
                  style={styles.floatingButton}
                >
                  +
                </button>
              </div>
              <div>
                <button onClick={this.handleLogout} style={styles.exitButton}>
                  Sair
                </button>
              </div>
            </div>
          </div>
        );
      }
      return (
        <div>
          <Modal
            onClose={this}
            show={this.state.show === "add"}
            title="Adicionar Notícia"
          >
            Message in Modal
          </Modal>
          <ModalEdit
            onClose={this}
            data={this.editData}
            show={this.state.show === "edit"}
            title="Editar Notícia"
          >
            Message in Modal
          </ModalEdit>
        </div>
      );
    }
    return (
      <form style={styles.container} onSubmit={this.handleSubmit}>
        <input
          style={styles.username}
          type="text"
          name="pin"
          placeholder="PIN"
          required
        />
        <button type="submit" style={styles.submitButton}>
          Entrar
        </button>
      </form>
    );
  }
}

const styles = {
  container: {
    display: "flex",
    textAlign: "center",
    flexDirection: "column",
    minWidth: "300px",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 20px",
    background: "rgb(255, 255, 255)",
    borderRadius: "4px",
    padding: "30px 20px"
  },
  submitButton: {
    height: "40px",
    textAlign: "center",
    alignItems: "center",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "14px",
    border: 0,
    color: "#fff",
    background: "#009587",
    marginTop: "5px"
  },
  exitButton: {
    height: "40px",
    textAlign: "center",
    alignItems: "center",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "10px",
    border: 0,
    color: "#fff",
    background: "#009587",
    marginTop: "5px",
    position: "fixed",
    margin: 16,
    right: 0,
    top: 0,
  },
  username: {
    height: "40px",
    padding: "0 15px",
    border: "1px solid #eee",
    borderRadius: "4px",
    marginBottom: "10px",
    color: "#444"
  },
  floatingButton: {
    position: "fixed",
    margin: 16,
    right: 0,
    bottom: 0,
    border: null,
    background: '#2096f3',
    borderRadius: 100,
    height: 50,
    width: 50,
    color: "white",
    fontSize: "xx-large",
    fontWeight: 500,
    borderStyle: "hidden",
  }
};

export default App;
