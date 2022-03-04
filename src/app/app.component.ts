import { Component, OnInit } from '@angular/core';
import * as signalR from "@microsoft/signalr";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'SignalR';
  data:any;
  lista:Array<any>;
  token: string;
  latitude: string;
  longitude: string;

  private hubConnection: signalR.HubConnection;
  constructor(){
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('https://bomberosnetcol.azurewebsites.net/notifications/localization',{
      accessTokenFactory: () => this.getAccessToken()
    })
    .build();
    this.lista = [];
    this.token = "";
    this.latitude = "22222";
    this.longitude = "222";
  }

  getAccessToken(): string {
    return this.token;   }
  public startConnection = () => {
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }


  public addTransferChartDataListener = () => {
    console.log("getting");
    this.hubConnection.on('NotificationFromServer', (data,fulldata) => {
      console.log(data);
      console.log(fulldata);
      this.lista.push(fulldata);
    });


  }

  senData(){
    var coordinat = new GeographicalCoordinates("ssss","ssss");
    var local = new UserLocalization("sscxxx", coordinat);
    console.log("sending");
    this.hubConnection.invoke("SendLocationDataToAllAsync", this.latitude, this.longitude).catch(err=> console.log(err))
  }

}

export class UserLocalization{

  constructor(userId: string, geographicalCoordinates: GeographicalCoordinates){
    this.userId = userId;
    this.geographicalCoordinates = geographicalCoordinates;
  }
  userId: string;
  geographicalCoordinates: GeographicalCoordinates;

}
export class GeographicalCoordinates{
  constructor(latitude:string, longitude: string) {
    this.latitude = latitude,
    this.longitude = longitude
  }
  latitude: string;
  longitude: string;
}

