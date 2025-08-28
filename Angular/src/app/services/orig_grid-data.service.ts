import { Injectable } from '@angular/core';

export class Task {
  ID: number = 0;
  AssignedEmployee: number = 0;
  OrderIndex: number = 0;
  Owner: number = 0;
  Priority: number = 0;
  Status: number = 0;
  Subject: string = "";
}

export class Customer {
  ID: number = 0;
  CompanyName: string = "";
  Address: string = "";
  City: string = "";
  State: string = "";
  Website: string = "";
}
const customers: Customer[] = [{
  ID: 1,
  CompanyName: 'Super Mart of the West',
  Address: '702 SW 8th Street',
  City: 'Bentonville',
  State: 'Arkansas',
  Website: 'http://www.nowebsitesupermart.com',
}, {
  ID: 2,
  CompanyName: 'Electronics Depot',
  Address: '2455 Paces Ferry Road NW',
  City: 'Atlanta',
  State: 'Georgia',
  Website: 'http://www.nowebsitedepot.com',
}, {
  ID: 3,
  CompanyName: 'K&S Music',
  Address: '1000 Nicllet Mall',
  City: 'Minneapolis',
  State: 'Minnesota',
  Website: 'http://www.nowebsitemusic.com',
}, {
  ID: 4,
  CompanyName: "Tom's Club",
  Address: '999 Lake Drive',
  City: 'Issaquah',
  State: 'Washington',
  Website: 'http://www.nowebsitetomsclub.com',
}, {
  ID: 5,
  CompanyName: 'E-Mart',
  Address: '3333 Beverly Rd',
  City: 'Hoffman Estates',
  State: 'Illinois',
  Website: 'http://www.nowebsiteemart.com',
}, {
  ID: 6,
  CompanyName: 'Walters',
  Address: '200 Wilmot Rd',
  City: 'Deerfield',
  State: 'Illinois',
  Website: 'http://www.nowebsitewalters.com',
}, {
  ID: 7,
  CompanyName: 'StereoShack',
  Address: '400 Commerce S',
  City: 'Fort Worth',
  State: 'Texas',
  Website: 'http://www.nowebsiteshack.com',
}, {
  ID: 8,
  CompanyName: 'Circuit Town',
  Address: '2200 Kensington Court',
  City: 'Oak Brook',
  State: 'Illinois',
  Website: 'http://www.nowebsitecircuittown.com',
}, {
  ID: 9,
  CompanyName: 'Premier Buy',
  Address: '7601 Penn Avenue South',
  City: 'Richfield',
  State: 'Minnesota',
  Website: 'http://www.nowebsitepremierbuy.com',
}, {
  ID: 10,
  CompanyName: 'ElectrixMax',
  Address: '263 Shuman Blvd',
  City: 'Naperville',
  State: 'Illinois',
  Website: 'http://www.nowebsiteelectrixmax.com',
}, {
  ID: 11,
  CompanyName: 'Video Emporium',
  Address: '1201 Elm Street',
  City: 'Dallas',
  State: 'Texas',
  Website: 'http://www.nowebsitevideoemporium.com',
}, {
  ID: 12,
  CompanyName: 'Screen Shop',
  Address: '1000 Lowes Blvd',
  City: 'Mooresville',
  State: 'North Carolina',
  Website: 'http://www.nowebsitescreenshop.com',
}];

@Injectable({
  providedIn: 'root'
})
export class GridDataService {
  getCustomers() : Customer[] {
    return customers;
  }
}
