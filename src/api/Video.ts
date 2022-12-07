export class Video{
  uri: string;

  constructor(video?: string) {
    if(video){
      const videoObj = JSON.parse(video);
      this.uri = videoObj.uri;
    }else{
      this.uri = "";
    }
  }

  getJSONString(){
    return JSON.stringify(this);
  }
}
