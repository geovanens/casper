import React from "react";
import "./modalEdit.css";
import database from "./firebaseSetup";

export default class ModalEdit extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      link_image: "",
      title: "",
      description: "",
      theme: "",
      link: ""
    };
  }
  
  componentDidMount() {
    const { image_link, title, description, theme, link } =  this.props.onClose.state.editData;
    this.setState({ link_image: image_link });
    this.setState({ title: title });
    this.setState({ description: description });
    this.setState({ theme: theme });
    this.setState({ link: link });
    console.log("Carregado", this)
  }
  
  handleSubmit(e) {
    e.preventDefault();
    const { link_image, title, description, theme, link } = this.state;
    
    var key = e.target.id;
    const notice = {
      image_link: link_image,
      title: title,
      description: description,
      theme: theme,
      link: link
    };
    database.ref("/notices/" + key).set(notice, function(error) {
      if (error) {
        alert("Data could not be changed." + error);
      } else {
        alert("Data changed successfully.");
        window.location.reload();
      }
    });
  }

  /*
  description: "Demitido do cargo de treinador ap?s a derrota em casa para o Cuiab?, no jogo de ida das oitavas da Copa do Brasil, ele afirma que fica para ajudar"
id: "0"
image_link: "https://s2.glbimg.com/YmoxUtUP2PgcAvZ4zD41XRkXMEc=/0x0:2025x1681/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2020/e/D/G7DMJ0QiOWVSPD7V7cnA/40-2-.jpg"
link: "https://globoesporte.globo.com/futebol/times/botafogo/noticia/bruno-lazaroni-agradece-botafogo-e-jogadores-e-diz-experiencia-muito-importante.ghtml"
theme: "sports"
title: "Bruno Lazaroni agradece Botafogo e jogadores e diz: 'Experi?ncia muito importante'"
  */
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
    if (!this.props.show) {
      return null;
    }
    return (
      <div class="modalEdit" id="modalEdit">
        <h2>{this.props.title}</h2>
        <div class="contentForm">
          <form onSubmit={ e => this.handleSubmit(e) } id={this.props.onClose.state.editData.id}>
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
            <button type="submit">
              Salvar
            </button>
          </form>
        </div>
        <div class="actions">
          <button
            class="toggle-button"
            name="close"
            onClick={e => this.props.onClose.showModal(e)}
          >
            close
          </button>
        </div>
      </div>
    );
  }
}
