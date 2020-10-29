import React from "react";
import "./modal.css";
import PropTypes from "prop-types";
import database from './firebaseSetup';

export default class Modal extends React.Component {
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  handleSubmit = (e) => {
    e.preventDefault(); 
    var newKey = database.ref('/notices').push().key;
    const link_image = e.target.elements.linkimage.value;
    const title = e.target.elements.title.value;
    const description = e.target.elements.description.value;
    const theme = e.target.elements.theme.value;
    const link = e.target.elements.link.value;
    const notice  = {
        "image_link": link_image,
        "title": title,
        "description": description,
        "theme": theme,
        "link": link,
    };
    database.ref('/notices/'+newKey).set(notice, function(error) {
      if (error) {
        alert("Data could not be saved." + error);
      } else {
        alert("Data saved successfully.");
        window.location.reload();
      }
    });
    
  }

  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div class="modal" id="modal">
        <h2>Modal Window</h2>
        <div class="content">
        <form onSubmit={this.handleSubmit}>
            <div>
                <label>Link para Imagem:</label>  
                <input type="text" name="linkimage" required />
            </div>
            <div>
                <label>Título:</label>  
                <input type="text" name="title" required />
            </div>
            <div>
                <label>Descrição:</label>  
                <input type="text" name="description" required />
            </div>
            <div>
                <select id="theme" name="themes" required>
                    <option value="sports">Esportes</option>
                    <option value="famous">Famosos</option>
                    <option value="entertainment">Entretenimento</option>
                    <option value="policy">Politica</option>
                </select>
            </div>
            <div>
                <label>Link para Noticia:</label>  
                <input type="text" name="link" required />
            </div>
            <button type="submit" >Adicionar</button>
        </form>
        </div>
        <div class="actions">
          <button class="toggle-button" onClick={this.onClose}>
            close
          </button>
        </div>
      </div>
    );
  }
}
Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
};