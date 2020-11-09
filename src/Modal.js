import React from "react";
import "./modal.css";
import axios from "axios";

export default class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      link_image: "",
      title: "",
      description: "",
      theme: "famous",
      link: ""
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    const { link_image, title, description, theme, link } = this.state;
    const notice = {
      image_link: link_image,
      title: title,
      description: description,
      theme: theme,
      link: link
    };
    const data = {
      "notice": notice
    };
    axios.post("https://api-webhook.glitch.me/notices", data).then(res => {
        window.location.reload();
    }).catch(error => {
      alert("Data could not be saved." + error);
      console.log(error);
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  render() {
    const { link_image, title, description, theme, link } = this.state;
    const MYPIN = process.env.REACT_APP_MYPIN;
    const PIN = localStorage.getItem("adminPIN");
    if (!this.props.show) {
      return null;
    }
    return (
      <div class="modal" id="modal">
        <h2>{this.props.title}</h2>
        <div class="content">
          <form onSubmit={e => this.handleSubmit(e)}>
            <div>
              <label>Link para Imagem:</label>
              <input
                type="text"
                name="link_image"
                value={link_image}
                onChange={event => this.handleInputChange(event)}
                required
              />
            </div>
            <div>
              <label>Título:</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={event => this.handleInputChange(event)}
                required
              />
            </div>
            <div>
              <label>Descrição:</label>
              <input
                type="text"
                name="description"
                value={description}
                onChange={event => this.handleInputChange(event)}
                required
              />
            </div>
            <div>
              <label>Tema</label>
              <select
                id="theme"
                name="theme"
                value={theme}
                onChange={event => this.handleInputChange(event)}
                required
              >
                <option value="sports">Esportes</option>
                <option value="famous">Famosos</option>
                <option value="entertainment">Entretenimento</option>
                <option value="policy">Politica</option>
              </select>
            </div>
            <div>
              <label>Link para Noticia:</label>
              <input
                type="text"
                name="link"
                value={link}
                onChange={event => this.handleInputChange(event)}
                required
              />
            </div>
            <button type="submit" disabled={PIN !== MYPIN}>
              Adicionar
            </button>
          </form>
        </div>
        <div class="actions">
          <button
            class="toggle-button"
            name="close"
            onClick={e => this.props.onClose.showModal(e)}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }
}
