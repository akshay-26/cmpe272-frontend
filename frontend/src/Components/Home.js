import React, { Component } from 'react'
import NavBar from './NavBar'
import { uploadImages } from './S3Upload'
import LinearProgress from '@mui/material/LinearProgress';
import styles from './home.css'
var axios = require('axios').default
export class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            file: "",
            isLoading: false
        }
    }
    handleFileChange = (e) => {
        console.log(e.target.files[0])
        this.setState({ ...this.state, file: e.target.files[0] })
    }


    async uploadFile() {
        console.log(this.state.file)
        // let url=``
        // let fileData=new FormData();
        // fileData.append('file',fileData)
        // axios.post(url,fileData).then(res=>{
        //     console.log(res)
        // })
        let file = this.state.file
        if (file) {
            this.setState({ isLoading: true })
            let [filename, ext] = file.name.split(".")
            let newname = filename.replace(/ +/g, "").trim() + new Date().valueOf() + "." + ext;
            let newFile = new File([file], newname)
            let imgLocation = await (await uploadImages(newFile)).location
            const data = {
                url: imgLocation
            }
            // imgLocation=decodeURI(imgLocation)
            console.log(imgLocation)
            axios.post('http://localhost:5000/predict', data).then(res => {
                console.log(res)
                this.setState({ isLoading: false })
            }).catch(err => {
                console.log(err)
                this.setState({ isLoading: false })
            })
        }

    }
    render() {
        // console.log(this.state.file);
        console.log(`${process.env.REACT_APP_TEST}`)
        return (
            <React.Fragment>
                <NavBar></NavBar>

                <input type="file" className="form-control-md" onChange={this.handleFileChange} />
                <button type="button" className="btn btn-primary" accept="image/png, image/jpeg" onClick={e => this.uploadFile()}>Upload</button>

                {/* <div style={{
                    position:"fixed",
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: "#fff",
                    opacity: "0.2",
                    zIndex: 1000
                }}>
                        <LinearProgress color="inherit" />
                </div> */}
                {/* <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div> */}
            </React.Fragment>
        )
    }
}

export default Home
