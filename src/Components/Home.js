import React, { Component } from 'react'
import NavBar from './NavBar'
var axios=require('axios').default
export class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            file:""
        }
    }
    handleFileChange=(e)=>{
        console.log(e.target.files[0])
        this.setState({...this.state, file:e.target.files[0]})
    }
    

    uploadFile=()=>{
        console.log(this.state.file)
        let url=``
        let fileData=new FormData();
        fileData.append('file',fileData)
        axios.post(url,fileData).then(res=>{
            console.log(res)
        })
    }
    render() {
        // console.log(this.state.file);
        return (
            <React.Fragment>
                <NavBar></NavBar>

                <input type="file" className="form-control-md"  onChange={this.handleFileChange}/>
                <button type="button" className="btn btn-primary" accept="image/png, image/jpeg" onClick={this.uploadFile}>Upload</button>
            </React.Fragment>
        )
    }
}

export default Home
