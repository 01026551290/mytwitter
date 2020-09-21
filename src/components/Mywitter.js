import React, {useState} from "react";
import {dbService , storageService} from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const MyWitter = ({myWiiterObj , isOwner}) => {
    const [editing ,setEditing] = useState(false);
    const [newMyWitter, setNewMyWitter] = useState(myWiiterObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete?");
        console.log(ok);
        if(ok){
            await dbService.doc(`myWitters/${myWiiterObj.id}`).delete();
            await storageService.refFromURL(myWiiterObj.attachmentUrl).delete();
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`myWitters/${myWiiterObj.id}`).update({
            text: newMyWitter
        })
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewMyWitter(value);
    };
    return (
        <div className="nweet">
          {
              editing ? (
                  <>
                      <form onSubmit={onSubmit} className="container nweetEdit">
                          <input type="text" placeholder="Edit your Witter" onChange={onChange} autoFocus value={newMyWitter} required className="formInput"/>
                          <input type="submit" value="Update Mywitter" className="formBtn" />
                      </form>
                      <span onClick={toggleEditing} className="formBtn cancelBtn">
                        Cancel
                      </span>
                  </>
                  ) : (
                  <>
                      <h4>{myWiiterObj.text}</h4>
                      {myWiiterObj.attachmentUrl && <img src={myWiiterObj.attachmentUrl} />}
                      {isOwner && (
                          <div className="nweet__actions">
                              <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                              </span>
                              <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                              </span>
                          </div>
                      )}
                  </>
              )
          }
      </div>
  );
};

export default MyWitter;