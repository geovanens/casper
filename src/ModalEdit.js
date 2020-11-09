import React from "react";
import "./modalEdit.css";
import axios from "axios";

export default class ModalEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      link_image: "",
      title: "",
      description: "",
      theme: "",
      link: "",
      id: ""
    };
  }

  componentDidMount() {
    console.log("EDITDATA", this.props.data)
    const {
      image_link,
      title,
      description,
      theme,
      link,
      _id
    } = this.props.onClose.state.editData;
    this.setState({ link_image: image_link });
    this.setState({ title: title });
    this.setState({ description: description });
    this.setState({ theme: theme });
    this.setState({ link: link });
    this.setState({ id: _id });
    console.log("Carregado", this);
    console.log(this.props.onClose.state.editData)
  }

  handleSubmit(e) {
    console.log("CLIQUEI EM SALVAR", e);
    e.preventDefault();
    const { link_image, title, description, theme, link, id } = this.state;

    var key = e.target.id;
    const notice = {
      image_link: link_image,
      title: title,
      description: description,
      theme: theme,
      link: link
    };
    const data = {
      notice: notice,
      id: key
    };
    axios
      .put("https://api-webhook.glitch.me/notices", data)
      .then(res => {
        alert("Data changed successfully.");
        window.location.reload();
      })
      .catch(error => {
        alert("Data could not be changed." + error);
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
    const { link_image, title, description, theme, link, id } = this.state;
    if (!this.props.show) {
      return null;
    }
    return (
      <div class="modalEdit" id="modalEdit">
        <h2>{this.props.title}</h2>
        <div class="contentForm">
          <form
            onSubmit={e => this.handleSubmit(e)}
            id={id}
          >
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
              <label>Tema:</label>
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
            <button type="submit">Salvar</button>
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
