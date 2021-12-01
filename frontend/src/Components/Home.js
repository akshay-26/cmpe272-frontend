import React, { Component } from 'react'
import NavBar from './NavBar'
import { uploadImages } from './S3Upload'
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
var axios = require('axios').default
export class Home extends Component {
    constructor(props) {
        super(props)
        this.inputFile = React.createRef()
        this.state = {
            file: "",
            isLoading: false,
            isResultSuccess: false,
            isResultFailed: false,
            img: '',
            response: ''
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
        // this.inputFile.current.click()
        // console.log(this)
        let file = this.state.file
        if (file) {
            this.setState({ isLoading: true,
                isResultSuccess:false })
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
                this.setState({
                    isLoading: false,
                    isResultSuccess: true,
                    img: imgLocation,
                    response: res.data
                })
            }).catch(err => {
                console.log(err)
                this.setState({
                    isLoading: false,
                    isResultFailed: true,

                })
            })
        }

    }
    render() {
        // console.log(this.state.file);
        console.log(`${process.env.REACT_APP_TEST}`)
        return (
            <React.Fragment>
                <NavBar></NavBar>
                {/* <Information></Information> */}
                <input type="file" className="form-control-md" onChange={this.handleFileChange} ref={this.inputFile} />
                <br />
                <button type="button" className="btn btn-primary" accept="image/png, image/jpeg" onClick={e => this.uploadFile()}>Check Your result</button>

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
                {this.state.isLoading ? <div className="spinner-border" role="status" >
                    <span class="visually-hidden">Loading...</span>
                </div> : ""}
                {this.state.isResultSuccess ?
                    <div class="d-flex justify-content-center mt-4">
                        <Card sx={{ maxWidth: 345 }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={this.state.img}
                            // 
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Model Prediction Result
                                </Typography>
                                <Typography variant="h6" color="text.secondary">
                                    {this.state.response.data === "DRUSEN" ?
                                        <div>
                                            Result: {this.state.response.data}
                                            <br />
                                            <a href="https://www.aao.org/eye-health/diseases/what-are-drusen">Click here to Know More about DRUSEN</a>
                                        </div>
                                        : ""}
                                    {this.state.response.data === "NORMAL" ?
                                        <div>
                                            Result: {this.state.response.data}
                                            <br />
                                            You're Perfectly Alright, way to goo, woohooo
                                        </div>
                                        : ""}
                                    {this.state.response.data === "DME" ?
                                        <div>
                                            Result: {this.state.response.data}
                                            <br />
                                            <a href="https://eyewiki.aao.org/Diabetic_Macular_Edema">Click here to Know More about DME</a>
                                        </div>
                                        : ""}

                                    {this.state.response.data === "CNV" ?
                                        <div>
                                            Result: {this.state.response.data}
                                            <br />
                                            <a href="https://eyewiki.aao.org/Choroidal_Neovascularization:_OCT_Angiography_Findings">Click here to Know More about CNV</a>
                                        </div>
                                        : ""}
                                </Typography>
                            </CardContent>
                            {/* <CardActions>
                        <Button size="small">Share</Button>
                        <Button size="small">Learn More</Button>
                    </CardActions> */}
                        </Card>
                    </div>
                    : ""}
            </React.Fragment>
        )
    }
}

export default Home
