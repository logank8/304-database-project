import { useEffect, useState } from 'react'
import './App.css'
import { DataGrid } from '@mui/x-data-grid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [data, setData] = useState();
  const getBasicStuff = async ()=>{
    const response = await (fetch("http://localhost:3000/").then(res => res.text()));
    console.log(response)
    setData(JSON.stringify(response));
  }

  const resetDatabase = async ()=>{
    await fetch("http://localhost:3000/reset_database")
  }

  const dumpDb = async ()=>{
    const dbDump = await (fetch("http://localhost:3000/get_all_tables").then(res => res.text()))
    console.log(dbDump);
  }

  const [showDebug, setShowDebug] = useState(false)
  
  return (
    <>
      <h2>Social media admin console</h2>
      
      <Insert/>
      <hr/>
      <Delete/>
      <hr/>
      <Update/>
      <hr/>
      <Sel_Query/>
      <hr/>
      <Proj_Query/>
      <hr/>
      <Join_Query/>
      <hr/>
      <Group_By_Query/>
      <hr/>
      <Aggregation_With_Having_Query/>
      <hr/>
      <Nested_Aggregation_With_Group_By_Query/>
      <hr/>
      <Division_Query/>
        <button onClick = {()=>{setShowDebug(!showDebug)}}>toggle debug options</button>
        {showDebug ? <>
            <button onClick = {()=>{getBasicStuff()}}>get trivial response from server</button>
            <p>response from server: {data}</p>
            <button onClick = {()=>{resetDatabase()}}>reset and initialize database</button>
            <button onClick = {()=>{dumpDb()}}>dump db state to console</button>
            <hr/>
        </> : <></>}
      <ToastContainer
					position="bottom-right"
					autoClose={2000}
					hideProgressBar
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="light"
				/>

    </>
  )
}

async function sendFormDataTo(e, url){
    // Prevent the browser from reloading the page
    e.preventDefault();

    const form = e.target;
    console.log(form);

      let formdata = new FormData(form);

      let requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };

      fetch(url, requestOptions)
        .then(response => {
            return response.text();
        })
        .then(result => {
          if(result == "error"){
            toast.error("ERROR");
          } else {
            toast.success("Database updated succesfully")
          }
          console.log(result)})
        .catch(error => {
          console.log('error', error);
          console.log("the last action failed!!!")});
}

function Delete() {
  return(
    <div>
      <h3>Delete post</h3>
      <form method="post" onSubmit={(e) => sendFormDataTo(e, "http://localhost:3000/remove_post")}>
        <label>
          Post ID =  <input name = "votableID" defaultValue= " "/>
        </label>
        <button type="submit">delete</button>
      </form>
    </div>
  );
}

function Insert() {
  return(
    <div>
      <h3>Add new subreddit</h3>
      <form method="post" onSubmit={(e) => sendFormDataTo(e, "http://localhost:3000/add_subreddit")}>
        <label>
          Subreddit name: <input name = "subname" defaultValue= ""/>
        </label>
        <label>
          User associated with subreddit:
            <select name = "username">
                <option value="ben">ben</option>
                <option value="bob">bob</option>
                <option value="gavin">gavin</option>
                <option value="helen">helen</option>
                <option value="robert">robert</option>
            </select>
        </label>
        <button type="submit">add</button>
      </form>
    </div>
  );
}

function Sel_Query(){
  async function sendFormDataToForSelect(e, url){
    // Prevent the browser from reloading the page
    e.preventDefault();

    const form = e.target;
    console.log(form);

      let formdata = new FormData(form);

      let requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };

      // hack to set column headings for result
      const formJson = Object.fromEntries(formdata.entries());
      console.log(formJson);
      setColumnHeadings(formJson["SELECT"].replaceAll(' ','').split(","));

      fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log("result below");
          console.log(result);
          if(result == 'error'){
            toast.error("ERROR: invalid params");
          } else {
            toast.success("got table data successfully");
            setRows(JSON.parse(result));
          }
          console.log(JSON.parse(result));})
        .catch(error => console.log('error', error));
        // todo send toast here with some info about the operation done
}

  const [columnHeadings, setColumnHeadings] = useState([]);
  const [rows2, setRows] = useState([]);
  return(
    <div>
    <div>
      <h3>Get table data</h3>
      <form method="post" onSubmit={(e) => sendFormDataToForSelect(e, "http://localhost:3000/table_display")}>
          <label>
              Select table
              <select name = "FROM" defaultValue={"Subreddit"}>
                  <option value="Ad">Ad (id, content, link, category, adminId)</option>
                  <option value="Ban">Ban (adminId, userId)</option>
                  <option value="Broadcast">Broadcast (liveId, title, quality, creatorId, views)</option>
                  <option value="Comment">Comment (votableId, parentId, awards, content, creatorId)</option>
                  <option value="FriendsWith">FriendsWith (friend1, friend2)</option>
                  <option value="Location">Location (city, serverName)</option>
                  <option value="Message">Message (messageId, sender, receiver)</option>
                  <option value="Popular">Popular (views, popularity)</option>
                  <option value="Posts">Posts (votableId, subId)</option>
                  <option value="Serves">Serves (adId, subId)</option>
                  <option value="Subreddit">Subreddit (subName, creatorId)</option>
                  <option value="Subscribes">Subscribes (userId, subId)</option>
                  <option value="Thumbnail">Thumbnail (liveId, postId, imageData)</option>
                  <option value="UserTable">Users (username, password, joinDate, avatarData, city)</option>
                  <option value="Votable">Votable (votableId, awards, content, creatorId)</option>
                  <option value="VotesOn">VotesOn (userId, votableId)</option>
              </select>
          </label>
      <br/>
        <label>
          Attributes (comma separated list): <input name = "SELECT" size={100} defaultValue = "creatorId"/>
        </label>
          <br/>
        <label>
          Filters (comma separated list): <input name = "WHERE" size={100} defaultValue= "creatorId = 'gavin'"/>
        </label>
          <br/>
        <button type="submit">execute query</button>
      </form>
    </div>
    <div>
        <DataGrid
        rows={
          rows2.map((val, i) => ({...val, id: i}))
        //   [
        //   { id: 1, col1: 'Hello', col2: 'World' },
        //   { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
        //   { id: 3, col1: 'MUI', col2: 'is Amazing' },
        // ]
      }
        columns= {columnHeadings.map((val) => ({field: val, headerName: val, width: 150 }))}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        />
    </div>
    </div>

  );
}

function Update(){
  return(
    <div>
      <h3>Edit Subreddit Info</h3>
      <form method="post" onSubmit={(e) => sendFormDataTo(e, "http://localhost:3000/subreddit_rename")}>
        <label>
          Subreddit name <input name = "PK" defaultValue = "dogs"/>
        </label>
          <label>
              Set new owner to:
              <select name = "new">
                  <option value="ben">ben</option>
                  <option value="bob">bob</option>
                  <option value="gavin">gavin</option>
                  <option value="helen">helen</option>
                  <option value="robert">robert</option>
              </select>
          </label>
        <button type="submit">update</button>
      </form>
    </div>
  );
}

function Proj_Query(){
  async function sendFormDataToForSelect(e, url){
    // Prevent the browser from reloading the page
    e.preventDefault();

    const form = e.target;
    console.log(form);

      let formdata = new FormData(form);

      let requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };

      // hack to set column headings for result
      const formJson = Object.fromEntries(formdata.entries());
      console.log(formJson);
      setColumnHeadings(formJson["SELECT"].replaceAll(' ','').split(","));

      fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log("result below");
          console.log(result);
          if(result == 'error'){
            toast.error("ERROR: invalid params");
          } else {
            toast.success("got table data successfully");
            setRows(JSON.parse(result));
          }
        console.log(JSON.parse(result));})
        .catch(error => console.log('error', error));
        // todo send toast here with some info about the operation done
}

  const [columnHeadings, setColumnHeadings] = useState([]);
  const [rows2, setRows] = useState([]);
  return(
    <div>
    <div>
      <h3>Display table columns</h3>
      <form method="post" onSubmit={(e) => sendFormDataToForSelect(e, "http://localhost:3000/table_display")}>
          <label>
              Select table
              <select name = "FROM" defaultValue={"Subreddit"}>
                  <option value="Ad">Ad (id, content, link, category, adminId)</option>
                  <option value="Ban">Ban (adminId, userId)</option>
                  <option value="Broadcast">Broadcast (liveId, title, quality, creatorId, views)</option>
                  <option value="Comment">Comment (votableId, parentId, awards, content, creatorId)</option>
                  <option value="FriendsWith">FriendsWith (friend1, friend2)</option>
                  <option value="Location">Location (city, serverName)</option>
                  <option value="Message">Message (messageId, sender, receiver)</option>
                  <option value="Popular">Popular (views, popularity)</option>
                  <option value="Posts">Posts (votableId, subId)</option>
                  <option value="Serves">Serves (adId, subId)</option>
                  <option value="Subreddit">Subreddit (subName, creatorId)</option>
                  <option value="Subscribes">Subscribes (userId, subId)</option>
                  <option value="Thumbnail">Thumbnail (liveId, postId, imageData)</option>
                  <option value="UserTable">Users (username, password, joinDate, avatarData, city)</option>
                  <option value="Votable">Votable (votableId, awards, content, creatorId)</option>
                  <option value="VotesOn">VotesOn (userId, votableId)</option>
              </select>
          </label>
          <br/>
        <label>
          Attributes (comma separated list) <input name = "SELECT" defaultValue = "friend1, friend2"/>
        </label>
        <input type="hidden" name = "WHERE" defaultValue= "true"/>
          <br/>
        <button type="submit">execute query</button>
      </form>
    </div>
    <div>
        <DataGrid
        rows={
          rows2.map((val, i) => ({...val, id: i}))
        //   [
        //   { id: 1, col1: 'Hello', col2: 'World' },
        //   { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
        //   { id: 3, col1: 'MUI', col2: 'is Amazing' },
        // ]
      }
        columns= {columnHeadings.map((val) => ({field: val, headerName: val, width: 150 }))}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        />
    </div>
    </div>

  );
}

function Join_Query(){

  const [numSubComments, setNumSubComments] = useState(0);

  async function sendFormDataToForJoin(e, url){
    // Prevent the browser from reloading the page
    e.preventDefault();

    const form = e.target;
    console.log(form);

      let formdata = new FormData(form);

      let requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };

      // // hack to set column headings for result
      // const formJson = Object.fromEntries(formdata.entries());
      // console.log(formJson);
      // setColumnHeadings(formJson["SELECT"].replaceAll(' ','').split(","));

      fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log("result below");
          console.log(result);
          setNumSubComments(JSON.parse(result)["COUNT(C.votableId)"]);
          // setRows(JSON.parse(result));
          toast.success("got data successfully");
        console.log(JSON.parse(result));})
        .catch(error => console.log('error', error));
        // todo send toast here with some info about the operation done
}

  return(
    <div>
      <h3>Find # of comments on a post</h3>
      <form method="post" onSubmit={(e) => sendFormDataToForJoin(e, "http://localhost:3000/post_comments")}>
        <label>
          Post ID <input name = "input" defaultValue = "1"/>
        </label>
        <button type="submit">execute query</button>
      </form>
      <p>number of comments on post: {numSubComments}</p>
    </div>
  );
}

function Group_By_Query(){
  async function sendFormDataToForSelect(e, url){
    // Prevent the browser from reloading the page
    e.preventDefault();

    const form = e.target;
    console.log(form);

      let formdata = new FormData(form);

      let requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };

      // hack to set column headings for result
      const formJson = Object.fromEntries(formdata.entries());
      console.log(formJson);

      fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log("result below");
          console.log(result);
          setRows(JSON.parse(result));
          toast.success("got data successfully");
        console.log(JSON.parse(result));})
        .catch(error => console.log('error', error));
        // todo send toast here with some info about the operation done
}

  const [rows2, setRows] = useState([]);
  return(
    <div>
    <div>
      <h3>List of all subreddits with associated amount of posts in that subreddit</h3>
      <form method="post" onSubmit={(e) => sendFormDataToForSelect(e, "http://localhost:3000/group_by_query")}>
        <button type="submit">execute query</button>
      </form>
    </div>
    <div>
        <DataGrid
        rows={
          rows2.map((val, i) => ({...val, id: i}))
        //   [
        //   { id: 1, col1: 'Hello', col2: 'World' },
        //   { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
        //   { id: 3, col1: 'MUI', col2: 'is Amazing' },
        // ]
      }
        columns= {["subId", "COUNT(P.votableID)"].map((val) => ({field: val, headerName: val, width: 150 }))}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        />
    </div>
    </div>

  );
}

function Aggregation_With_Having_Query(){
  async function sendFormDataToForSelect(e, url){
    // Prevent the browser from reloading the page
    e.preventDefault();

    const form = e.target;
    console.log(form);

      let formdata = new FormData(form);

      let requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };

      // hack to set column headings for result
      const formJson = Object.fromEntries(formdata.entries());
      console.log(formJson);

      fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log("result below");
          console.log(result);
          setRows(JSON.parse(result));
          toast.success("got data successfully");
        console.log(JSON.parse(result));})
        .catch(error => console.log('error', error));
        // todo send toast here with some info about the operation done
}

  const [rows2, setRows] = useState([]);
  return(
    <div>
    <div>
      <h3>Max amount of views of live broadcasts by the most popular creators</h3>
      <form method="post" onSubmit={(e) => sendFormDataToForSelect(e, "http://localhost:3000/aggregation_with_having")}>
        <button type="submit">execute query</button>
      </form>
    </div>
    <div>
        <DataGrid
        rows={
          rows2.map((val, i) => ({...val, id: i}))
        //   [
        //   { id: 1, col1: 'Hello', col2: 'World' },
        //   { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
        //   { id: 3, col1: 'MUI', col2: 'is Amazing' },
        // ]
      }
        columns= {["creatorId", "MAX(B.views)"].map((val) => ({field: val, headerName: val, width: 150 }))}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        />
    </div>
    </div>

  );
}

function Nested_Aggregation_With_Group_By_Query(){
  async function sendFormDataToForSelect(e, url){
    // Prevent the browser from reloading the page
    e.preventDefault();

    const form = e.target;
    console.log(form);

      let formdata = new FormData(form);

      let requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };

      // hack to set column headings for result
      const formJson = Object.fromEntries(formdata.entries());
      console.log(formJson);

      fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log("result below");
          console.log(result);
          setRows(JSON.parse(result));
          toast.success("got data successfully");
        console.log(JSON.parse(result));})
        .catch(error => console.log('error', error));
        // todo send toast here with some info about the operation done
}

  const [rows2, setRows] = useState([]);
  return(
    <div>
    <div>
      <h3>Average views of every popularity ranking</h3>
      <form method="post" onSubmit={(e) => sendFormDataToForSelect(e, "http://localhost:3000/nested_aggregation_with_group_by")}>
        <button type="submit">execute query</button>
      </form>
    </div>
    <div>
        <DataGrid
        rows={
          rows2.map((val, i) => ({...val, id: i}))
        //   [
        //   { id: 1, col1: 'Hello', col2: 'World' },
        //   { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
        //   { id: 3, col1: 'MUI', col2: 'is Amazing' },
        // ]
      }
        columns= {["popularity", "AVG(P.views)"].map((val) => ({field: val, headerName: val, width: 150 }))}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        />
    </div>
    </div>

  );
}

function Division_Query(){

  const [numUsers, setNumUsers] = useState(0);

  async function sendFormDataToForJoin(e, url){
    // Prevent the browser from reloading the page
    e.preventDefault();

    const form = e.target;
    console.log(form);

      let formdata = new FormData(form);

      let requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };

      // // hack to set column headings for result
      // const formJson = Object.fromEntries(formdata.entries());
      // console.log(formJson);
      // setColumnHeadings(formJson["SELECT"].replaceAll(' ','').split(","));

      fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log("result below");
          console.log(result);
          setNumUsers(JSON.parse(result)[0]["COUNT (U.username)"]);
          toast.success("got data successfully");
        console.log(JSON.parse(result));})
        .catch(error => console.log('error', error));
        // todo send toast here with some info about the operation done
}

  return(
    <div>
      <h3>Number of users that are in every subreddit</h3>
      <form method="post" onSubmit={(e) => sendFormDataToForJoin(e, "http://localhost:3000/min_subscribers")}>
        {/* <label>
          Post PK <input name = "input" defaultValue = "1"/>
        </label> */}
        <button type="submit">execute query</button>
      </form>
      <p>number of users subscribed to every subreddit: {numUsers}</p>
    </div>
  );
}

export default App
