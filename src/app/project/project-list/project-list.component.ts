import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { ProductImageModuleComponent } from 'src/app/master/product-image-module/product-image-module.component';
import { DatabaseService } from 'src/app/_services/DatabaseService';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  loading: any;
  source: any = "";
  loading_page = false;
  loading_list = false;
  loader: any = false;
  locations: any = [];
  row_item: any = [];
  sr_no:any=0;
  perPage=0;
  uploadurl:any
  last_page: number;
  current_page = 1;
  search: any = "";
  searchData = true;
  filter: any = {};
  filtering: any = false;
  
  constructor(
    public db: DatabaseService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: DialogComponent,
    public alrt: MatDialog
    ) { 
      this.uploadurl = this.db.uploadUrl2;
      
      this.getProjectList('');
    }
    
    ngOnInit() {
    }
    
    
    current1()
    {
      this.current_page = 1;
      this.getProjectList('');
    }
    last1()
    {
      this.current_page = this.last_page;
      this.getProjectList('');
    }
    redirect_previous() {
      this.current_page--;
      this.getProjectList('');
    }
    redirect_next() {
      if (this.current_page < this.last_page) { this.current_page++; }
      else { this.current_page = 1; }
      this.getProjectList('');
    }

    openDialog(imgurl, string) {
      const dialogRef = this.alrt.open(ProductImageModuleComponent, {
        data: {
          imgurl: imgurl,
          siteImg: string,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
    }
    
    
    getProjectList(action) {
      this.loading_list = true;
      this.filter.date = this.filter.date? this.db.pickerFormat(this.filter.date): "";
      if (this.filter.date || this.filter.location_id) this.filtering = true;
      this.filter.mode = 0;
      
      if (action == "refresh") {
        this.filter = {};
      }
      console.log(this.filter);
      
      this.db.post_rqst({ filter: this.filter, login: this.db.datauser },"karigar/project_listing?page=" + this.current_page)
      .subscribe((d) => {
        console.log(d);
        this.loading_list = false;
        this.current_page = d.projects.current_page;
        this.last_page = d.projects.last_page;
        this.row_item = d.projects.data;
        console.log(this.row_item);
        
        console.log(this.current_page - 1);
        this.perPage =d.projects.per_page;
        
        this.sr_no = this.current_page - 1;
        this.sr_no = this.sr_no * this.perPage;    
        console.log(this.sr_no);
        
        // for (let i = 0; i < this.products.length; i++) {
        //   if (this.products[i].status == "Active") {
        //     this.products[i].newsStatus = true;
        //   } else if (this.products[i].status == "Deactive") {
        //     this.products[i].newsStatus = false;
        //   }
        // }
        
      });
    }

    exportProject()
    {
        this.filter.mode = 1;
        this.db.post_rqst(  {'filter': this.filter , 'login':this.db.datauser,user_type:'1'}, 'karigar/exportProjects')
        .subscribe( d => {
            document.location.href = this.db.myurl+'/app/uploads/exports/project.csv';
            console.log(d);
        });
    }
    
  }
  