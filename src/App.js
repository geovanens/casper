import React from 'react';
import './App.css';
import Modal from './Modal';
import ModalEdit from './ModalEdit'

import database from './firebaseSetup';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: "main",
      notices: [
      ],
      themes : {
        "sports": "Esportes",
        "policy": "Política",
        "entertainment": "Entretenimento",
        "famous": "Famosos"
      },
      editData: {}
    };
  }

  componentDidMount() {
    console.log(process.env.REACT_APP_MYPIN);
    console.log(localStorage.getItem('adminPIN'));
    database.ref('/notices').once('value').then((snapshot) => {
      const temp = snapshot.val();
      const notices = [];
      Object.keys(temp).map(function(key, index) {
        const t2 = temp[key];
        t2.id = key;
        notices.push(t2);
      });
      this.setState({ notices: notices });
    });
    
  }

  handleSubmit(e) {
    e.preventDefault(); 
    const PIN = e.target.elements.pin.value;
    localStorage.setItem('adminPIN', PIN);
    window.location.reload();
  }

  handleLogout() {
    localStorage.removeItem('adminPIN');
    window.location.reload();
  }

  showModal(e) {
    const eventName = e.target.name;
    console.log(eventName)
    if (eventName === "add") {
        this.setState({ show: "add" });
    } else if (eventName === "edit") {
        this.setState({ show: "edit" });
    } else {
        this.setState({ show: "main" });
    }
    
  };
  
  editar (e) {
    const { notices } = this.state;
    const data = notices.filter(f => f.id === e.target.id)[0];
    this.setState({ editData: data }, this.showModal(e));
  }

  excluir (e) {
    const ID = e.target.id;    
    database.ref('/notices/'+ID).remove(function(error) {
      if (error) {
        alert("Data could not be removed." + error);
      } else {
        window.location.reload();
      }
    });
  }


  addNotice()  {
    this.showModal();
  }

  render() {
    const MYPIN = process.env.REACT_APP_MYPIN;
    const PIN = localStorage.getItem('adminPIN');
    const { notices, show, themes } = this.state;
    if (PIN !== null) {
      if (show === "main") {
        return (
          <div className="App">
            <div className="header">
              <div className="title">
                <h2 >Welcome to Casper</h2>
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
                {notices.map(e => <tr id={e.id}>
                  <td><p>{e.image_link}</p></td>
                  <td><p>{e.title}</p></td>
                  <td><p>{e.description}</p></td>
                  <td><p>{themes[e.theme]}</p></td>
                  <td><p>{e.link}</p></td>
                  <td><button type="button" name="edit" id={e.id} onClick={ e => this.editar(e) } disabled={PIN !== MYPIN}>Editar</button></td>
                  <td><button type="button" name="delete" id={e.id} onClick={ e=> this.excluir(e) } disabled={PIN !== MYPIN}>Excluir</button></td>
                </tr>)}
                </tbody>
              </table>
              <div>
                <button type="button" name="add" onClick={e => {this.showModal(e);}}>+</button>
              </div>
              <div>
                <button onClick={this.handleLogout} style={styles.submitButton}>Sair</button>
              </div>
            </div>
          </div>
        );
      }
      return (
        <div>
          <Modal onClose={this} show={this.state.show ===  "add"} title="Adicionar Notícia">
                  Message in Modal
          </Modal>
          <ModalEdit onClose={this} data={this.editData} show={this.state.show === "edit"} title="Editar Notícia">
                    Message in Modal
          </ModalEdit>
        </div>
        
        
      )
      
    }
    return (
      <form style={styles.container} onSubmit={this.handleSubmit}>
        <input style={styles.username} type="text" name="pin" placeholder="PIN" required />
        <button type="submit" style={styles.submitButton}>Entrar</button>
      </form>
    );
  }

}

const styles = {
  container: {
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'column',
    minWidth: '300px',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 20px',
    background: 'rgb(255, 255, 255)',
    borderRadius: '4px',
    padding: '30px 20px'
  },
  submitButton: {
    height: '40px',
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '14px',
    border: 0,
    color: '#fff',
    background: '#009587',
    marginTop: '5px',
  },
  username: {
    height: '40px',
    padding: '0 15px',
    border: '1px solid #eee',
    borderRadius: '4px',
    marginBottom: '10px',
    color: '#444'
  }
}

export default App;