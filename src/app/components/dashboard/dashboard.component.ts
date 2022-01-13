import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  files: any[] = [];

  userApiLimit: number = 0;

  avgQualityRes: number = 0;
  ScroeRes: number = 0;
  gradeRes: string = "";
  totalNoRes: number = 0;
  messageRes: string = "";

  constructor(private http: HttpClient, private firebaseService: FirebaseService, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.firestore.collection('user').doc(firebase.auth().currentUser?.uid).valueChanges().subscribe((res: any) => {
      console.log(res);
      this.userApiLimit = res.requestLimit;
    });
  }

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    console.log($event);
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler($event) {
    console.log($event);
    this.prepareFilesList($event.target.files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  deleteAllFiles() {
    this.files = [];
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }

    // files.forEach(item => {
    //   item.progress = 0;
    //   this.files.push(item);
    // })
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  async onFileUpload() {
    const headers = new Headers()
    const token = await firebase.auth().currentUser?.getIdToken();
    headers.set('authorization', `Bearer ${token?.toString()}`);

    let fileFormData = new FormData();
    fileFormData.append('file', this.files[0]);
    this.http.post("https://seed-detection-server.herokuapp.com/qualityDetection", fileFormData, { headers: { authorization: `Bearer ${token}` } }).subscribe((res: any) => {
      console.log(res.data.quality);
      this.avgQualityRes = res.data.quality.averageQuality;
      this.ScroeRes = parseInt(res.data.quality.grade.score);
      this.gradeRes = res.data.quality.grade.grade;
      this.totalNoRes = res.data.quality.maximumQualityInGroup;
      this.messageRes = res.data.quality.grade.message;

      this.firestore.collection('user').doc(firebase.auth().currentUser?.uid).update({
        requestLimit: firebase.firestore.FieldValue.increment(-1)
      }).then((updateRes: any) => {
        console.log(updateRes);
        this.userApiLimit -= 1;
      });

      this.deleteAllFiles();
    }, (err) => {
      console.log(err);
    })
  }

}
