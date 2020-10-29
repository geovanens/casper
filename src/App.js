import React from 'react';
import './App.css';
import './Table.css'
import Modal from './Modal';

import database from './firebaseSetup';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      notices: [
      ],
    };
  }

  componentDidMount() {
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

  handleSubmit = (e) => {
    e.preventDefault(); 
    const PIN = e.target.elements.pin.value;
    localStorage.setItem('adminPIN', PIN);
    window.location.reload();
  }

  handleLogout = () => {
    localStorage.removeItem('adminPIN');
    window.location.reload();
  }

  showModal = e => {
    this.setState({
      show: !this.state.show
    });
  };


  editar = e => {
    const { notices } = this.state;
    console.log("EDITANDO", e.target.id);
    console.log(notices.filter(f => f.id === e.target.id))
  }

  excluir = e => {
    console.log("Apagando", e.target.id);
  }

  render() {
    const PIN = localStorage.getItem('adminPIN');
    const { notices, show } = this.state;
    if (PIN !== null) {
      if (!show) {
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
                  <td><p>{e.theme}</p></td>
                  <td><p>{e.link}</p></td>
                  <td><button type="button" id={e.id} onClick={ this.editar }>Editar</button></td>
                  <td><button type="button" id={e.id} onClick={ this.excluir }>Excluir</button></td>
                </tr>)}
                </tbody>
              </table>
              <div>
                <button type="button" onClick={e => {this.showModal();}}>+</button>
              </div>
              <div>
                <button onClick={this.handleLogout} style={styles.submitButton}>Sair</button>
              </div>
            </div>
          </div>
        );
      }
      return (
        <Modal onClose={this.showModal} show={this.state.show}>
                  Message in Modal
        </Modal>
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