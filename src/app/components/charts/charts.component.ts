import { Component, OnInit, ViewChild } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ChartDataSets, ChartOptions, ChartType, RadialChartOptions } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.firestore.collection('user').doc(firebase.auth().currentUser?.uid).collection("results").valueChanges().subscribe(res => {
      const labels: any[] = [];
      const avgQuality: number[] = [];
      const score: number[] = [];
      res.forEach((item, index) => {
        if (item.response) {
          console.log(item);
          // labels.push(item.payload.doc.data().requestTime.toString());
          labels.push((index + 1).toString());
          avgQuality.push(item.responseValue.averageQuality);
          score.push(parseInt(item.responseValue.grade.score));
        } else console.log(item);
      })
      const bardata: ChartDataSets[] = [
        { data: avgQuality, label: 'Average Quality' },
        { data: score, label: 'Score' }
      ];

      this.updateBarChart(labels, bardata);
    })

  }

  updateBarChart(labels: any[], data: ChartDataSets[]) {
    this.barChartLabels = labels;
    this.barChartData = data;
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // Bar Chart
  public barChartOptions: ChartOptions = {
    scales: {
      yAxes: [
        {
          stacked: true
        }
      ],
      xAxes: [
        {
          stacked: true
        }
      ]
    },
    responsive: true
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [];
  public barChartLabels: Label[] = [];
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [];

}
