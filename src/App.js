import React, {useState, useEffect} from 'react';
import './App.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal,ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import Header from './Header';
import Footer from './Footer';

function App() {
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  const baseAuthorsURL = "http://localhost:5000/api/v1/library/authors";
  const [data, setData]=useState([]); 
  const [modalInsert, setModalInsert]=useState(false);
  const [modalEdit, setModalEdit]=useState(false);
  const [modalDelete, setModalDelete]=useState(false);  
  const [authorSelected, setAuthorSelected]=useState({
    id : '',
    name: '',
    lastName: '',
    email: ''
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setAuthorSelected({
      ...authorSelected,
      [name]: value
    });
    console.log(authorSelected);
  }

  const openCloseModalInsert=()=>{
    setModalInsert(!modalInsert);
  }

  
  const openCloseModalEdit=()=>{
    setModalEdit(!modalEdit);
  }

  const openCloseModalDelete=()=>{
    setModalDelete(!modalDelete);
  }

  const selectAuthor=(author, action)=>{
    setAuthorSelected(author);
    (action === "Edit")? 
    openCloseModalEdit(): openCloseModalDelete();
  } 

  const getAuthors=async()=>{
    await axios.get(baseAuthorsURL)
    .then(response=>{
       setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const postAuthors=async()=>{
    delete authorSelected.id;

    await axios.post(baseAuthorsURL, 
      {
        authorName: authorSelected.name,
        authorLastName: authorSelected.lastName,
        authorEmail: authorSelected.email
      }
    ).then(response=>{
         setData(data.concat(
           {
            id : response.data.authorId,
            name: response.data.authorName,
            lastName: response.data.authorLastName,
            email: response.data.authorEmail 
           }
         ));
         openCloseModalInsert();
         console.log(response.data);
      }).catch(error=>{
        console.log(error);
    })

  } 

  const putAuthors=async()=>{
  
    await axios.put(baseAuthorsURL+"/"+authorSelected.id, 
      {
        AuthorId: authorSelected.id,
        authorName: authorSelected.name,
        authorLastName: authorSelected.lastName,
        authorEmail: authorSelected.email
      }
    ).then(response=>{
         var responseObj = response.data;
         var dataAuxiliar=data;
         dataAuxiliar.map(author=>{
            if(author.id === authorSelected.id ) {  
               author.name = responseObj.authorName;
               author.lastName = responseObj.authorLastName;
               author.email = responseObj.authorEmail;
            }
         });
         openCloseModalEdit();
      }).catch(error=>{
        console.log(error);
    })

  }  

  const delAuthors=async()=>{
  
    await axios.delete(baseAuthorsURL+"/"+authorSelected.id)
    .then(response=>{
        setData(data.filter(author=>author.id !== response.data));
        openCloseModalDelete(); 
      }).catch(error=>{
        console.log(error);
    })

  }  


  useEffect(()=>{
    getAuthors();
  },[] )



  return (
    <>
    <div class="Title">
           <h1>CRUD Example</h1>;
    </div>
    <br/>
    <div className="App">

      <Header />
      <table class="styled-table" >
         <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
         </thead>
         <tbody>
         {data.map(author=>(
            <tr key={author.id}>
              <td>{author.id}</td>
              <td>{author.name}</td>
              <td>{author.lastName}</td>
              <td>{author.email}</td>
              <td>
                 <button className="btn btn-primary" onClick={()=>selectAuthor(author, "Edit")}>Edit</button> {"  "}  
                 <button className="btn btn-danger" onClick={()=>selectAuthor(author, "Delete")}>Delete</button>
              </td>
            </tr>
         ))}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" align="center">
               <button onClick={()=>openCloseModalInsert()} className="btn btn-success">Add new Author</button>
            </td>
          </tr>
        </tfoot>        
      </table>
      
      <Modal isOpen={modalInsert}>
         
         <table class="styled-table">
            <thead>
              <tr>
                <th>Add Author</th>
              </tr>
            </thead>
            <tbody>    
                <tr>
                  <td>
                    <ModalBody>
                      <div className="form-group">
                            <label>Name: </label>
                            <br/>
                            <input type="text" className="form-control" name="name" onChange={handleChange}/>
                            <br/>
                
                            <label>Last Name: </label>
                            <br/>
                            <input type="text" className="form-control" name="lastName" onChange={handleChange}/>
                            <br/>
                  
                            <label>Email: </label>
                            <br/>
                            <input type="text" className="form-control" name="email" onChange={handleChange}/>
                            <br/>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                          <button className="btn btn-primary" onClick={()=>postAuthors()}>Save</button> {"  "}
                          <button className="btn btn-danger" onClick={()=>openCloseModalInsert()}>Cancel</button>                
                    </ModalFooter>

                  </td>
                </tr>
            </tbody>
          </table>
      </Modal>

      <Modal isOpen={modalEdit}>

          <table class="styled-table">
            <thead>
              <tr>
                <th>Edit Author</th>
              </tr>
            </thead>
            <tbody>    
                <tr>
                  <td>
                      <ModalBody>
                        <div className="form-group">
                              <label>ID: </label>
                              <br/>
                              <input type="text" className="form-control" readOnly value={authorSelected && authorSelected.id} />
                              <br/>

                              <label>Name: </label>
                              <br/>
                              <input type="text" className="form-control" name="name" onChange={handleChange} value={authorSelected && authorSelected.name}/>
                              <br/>
                  
                              <label>Last Name: </label>
                              <br/>
                              <input type="text" className="form-control" name="lastName" onChange={handleChange} value={authorSelected && authorSelected.lastName}/>
                              <br/>
                    
                              <label>Email: </label>
                              <br/>
                              <input type="text" className="form-control" name="email" onChange={handleChange} value={authorSelected && authorSelected.email}/>
                              <br/>
                          
                        </div>
                      </ModalBody>
                      <ModalFooter>
                            <button className="btn btn-primary" onClick={()=>putAuthors()}>Save</button> {"  "}
                            <button className="btn btn-danger" onClick={()=>openCloseModalEdit()}>Cancel</button>                
                      </ModalFooter>

                  </td>
                </tr>
            </tbody>
          </table>        

      </Modal>

      <Modal isOpen={modalDelete}>
          <table class="styled-table">
            <thead>
              <tr>
                <th>Delete Author</th>
              </tr>
            </thead>
            <tbody>    
                <tr>
                  <td>
                      Are you sure you want to delete this author [ {authorSelected && authorSelected.name} ]?
                  </td>
                </tr>
                <tr>
                  <td align="right">
                      <button className="btn btn-danger" onClick={()=>delAuthors()}>Yes</button> {"  "}
                      <button className="btn btn-secondary" onClick={()=>openCloseModalDelete()}>No</button>                
                  </td>
                </tr>
            </tbody>
          </table>

      </Modal>
    </div>
    <div>
       <br/> 
       <Footer />
    </div>
    </>
  );
}

export default App;
