const axios = require('axios');
const Order = require('../models/order.model');

// Define your JSON payload
const genrateFedexToken = async()=>{
    try {
        const input = {
            "grant_type": "client_credentials",
            "client_id": `${process.env.FEDEX_CLIENT_ID}`,
            "client_secret": `${process.env.FEDEX_CLIENT_SECERT}`
            // Add more key-value pairs as needed
        };

        const response = await axios.post("https://apis-sandbox.fedex.com/oauth/token", input, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        return response.data.access_token;
        
    } catch (error) {
      return error;
    }
}
 
const customTrackingId = async(req,res)=>{
const  {id,url,trackingId} = req.body;
  try {
    await Order.findByIdAndUpdate(id,{trackingId:trackingId,trackingUrl:url});
    res.status(200).send({msg:'true'})
  } catch (error) {
    res.status(500).send(error);
  }

}
 const createShipping = async(req,res)=>{
    try {
        const data= req.body;
        const  shiperAddress= data.shiperAddress;
        const shipingAddress = data.shipingAddress;
        const orderdata = data.orderdata;
        const token = await genrateFedexToken();
     const input ={
      "requestedShipment": {
        "shipper": {
          "address": {
            "streetLines": [
              shiperAddress.streetAddress
            ],
            "city":  shiperAddress.city,
            "countryCode":  shiperAddress.country.toUpperCase(),
            "stateOrProvinceCode": shiperAddress.state.toUpperCase(),
            "postalCode":  shiperAddress.zipCode
          },
          "contact": {
            "personName":shiperAddress.name,
            "phoneNumber": shiperAddress.mobile
          }

        },
        "recipients": [
          {
            "address": {
              "streetLines": [
                shipingAddress.streetAddress
              ],
              "city": shipingAddress.city,
              "countryCode": shipingAddress.country.toUpperCase(),
              "stateOrProvinceCode":shipingAddress.state.toUpperCase(),
              "postalCode": shipingAddress.zipCode
            },
            "contact": {
              "personName":shipingAddress.name,
              "phoneNumber": shipingAddress.mobile
            }
          }
        ],
        "pickupType": "USE_SCHEDULED_PICKUP",
        "serviceType": "STANDARD_OVERNIGHT",
        "packagingType": "FEDEX_PAK",
        "shippingChargesPayment": {
          "paymentType": "SENDER"
        },
        "labelSpecification": {
          
        
          "labelStockType": "PAPER_85X11_TOP_HALF_LABEL",
          "imageType": "PDF"
        },
        "requestedPackageLineItems": [
          {
            "weight": {
              "units": "LB",
              "value": 1
            },
           
          }
        ]
      },
      "labelResponseOptions":"URL_ONLY",
      "accountNumber": {
        "value": `${process.env.FEDEX_ACC_NUMBER}`
      }

    }
  //  const datas = JSON.stringify(input);
      const response = await axios.post("https://apis-sandbox.fedex.com/ship/v1/shipments", input, {
          headers: {
              "Content-Type": "application/json",
              "X-locale": "en_US",
              "Authorization": "Bearer " + token // Add your bearer token here
          },
      //    withCredentials: true // If needed
      });
const responsedata = response.data;
 res.status(200).send(responsedata)
 if(responsedata){
  await Order.findByIdAndUpdate(orderdata._id,{trackingId:responsedata.output.transactionShipments[0].
    masterTrackingNumber});
 }
    } catch (error) {
      
      res.status(500).send(error);
    }
 }
 module.exports={createShipping,customTrackingId}


//  "dimensions": {
//   "height": {
//       "units": "CM",
//       "value": 20
//   },
//   "width": {
//       "units": "CM",
//       "value": 30
//   },}
 /*  const input ={
      "requestedShipment": {
        //"shipDatestamp": "2019-10-14",
        "totalDeclaredValue": {
          "amount": 12.45,
          "currency": "USD"
        },
        "shipper": {
          "address": {
            "streetLines": [
              "10 FedEx Parkway"
            ],
            "city": "Beverly Hills",
            "stateOrProvinceCode": "CA",
            "postalCode": "90210",
            "countryCode": "US",
            "residential": false
          },
          "contact": {
            "personName": "John Taylor",
            "emailAddress": "sample@company.com",
            "phoneExtension": "91",
            "phoneNumber": "XXXX567890",
            "companyName": "Fedex"
          },
          "tins": [
            {
              "number": "XXX567",
              "tinType": "FEDERAL",
              "usage": "usage",
              "effectiveDate": "2000-01-23T04:56:07.000+00:00",
              "expirationDate": "2000-01-23T04:56:07.000+00:00"
            }
          ]
        },
        "soldTo": {
          "address": {
            "streetLines": [
              "10 FedEx Parkway",
              "Suite 302"
            ],
            "city": "Beverly Hills",
            "stateOrProvinceCode": "CA",
            "postalCode": "90210",
            "countryCode": "US",
            "residential": false
          },
          "contact": {
            "personName": "John Taylor",
            "emailAddress": "sample@company.com",
            "phoneExtension": "91",
            "phoneNumber": "1234567890",
            "companyName": "Fedex"
          },
          "tins": [
            {
              "number": "123567",
              "tinType": "FEDERAL",
              "usage": "usage",
              "effectiveDate": "2000-01-23T04:56:07.000+00:00",
              "expirationDate": "2000-01-23T04:56:07.000+00:00"
            }
          ],
          "accountNumber": {
            "value": "Your account number"
          }
        },
        "recipients": [
          {
            "address": {
              "streetLines": [
                "10 FedEx Parkway",
                "Suite 302"
              ],
              "city": "Beverly Hills",
              "stateOrProvinceCode": "CA",
              "postalCode": "90210",
              "countryCode": "US",
              "residential": false
            },
            "contact": {
              "personName": "John Taylor",
              "emailAddress": "sample@company.com",
              "phoneExtension": "000",
              "phoneNumber": "XXXX345671",
              "companyName": "FedEx"
            },
            "tins": [
              {
                "number": "123567",
                "tinType": "FEDERAL",
                "usage": "usage",
                "effectiveDate": "2000-01-23T04:56:07.000+00:00",
                "expirationDate": "2000-01-23T04:56:07.000+00:00"
              }
            ],
            "deliveryInstructions": "Delivery Instructions"
          }
        ],
        "recipientLocationNumber": "1234567",
        "pickupType": "USE_SCHEDULED_PICKUP",
        "serviceType": "PRIORITY_OVERNIGHT",
        "packagingType": "FEDEX_PAK",
        "totalWeight": 20.6,
        "origin": {
          "address": {
            "streetLines": [
              "10 FedEx Parkway",
              "Suite 302"
            ],
            "city": "Beverly Hills",
            "stateOrProvinceCode": "CA",
            "postalCode": "38127",
            "countryCode": "US",
            "residential": false
          },
          "contact": {
            "personName": "person name",
            "emailAddress": "email address",
            "phoneNumber": "phone number",
            "phoneExtension": "phone extension",
            "companyName": "company name",
            "faxNumber": "fax number"
          }
        },
        "shippingChargesPayment": {
          "paymentType": "SENDER",
          "payor": {
            "responsibleParty": {
              "address": {
                "streetLines": [
                  "10 FedEx Parkway",
                  "Suite 302"
                ],
                "city": "Beverly Hills",
                "stateOrProvinceCode": "CA",
                "postalCode": "90210",
                "countryCode": "US",
                "residential": false
              },
              "contact": {
                "personName": "John Taylor",
                "emailAddress": "sample@company.com",
                "phoneNumber": "XXXX567890",
                "phoneExtension": "phone extension",
                "companyName": "Fedex",
                "faxNumber": "fax number"
              },
              "accountNumber": {
                "value": "Your account number"
              }
            }
          }
        },
        "shipmentSpecialServices": {
          "specialServiceTypes": [
            "THIRD_PARTY_CONSIGNEE",
            "PROTECTION_FROM_FREEZING"
          ],
          "etdDetail": {
            "attributes": [
              "POST_SHIPMENT_UPLOAD_REQUESTED"
            ],
            "attachedDocuments": [
              {
                "documentType": "PRO_FORMA_INVOICE",
                "documentReference": "DocumentReference",
                "description": "PRO FORMA INVOICE",
                "documentId": "090927d680038c61"
              }
            ],
            "requestedDocumentTypes": [
              "VICS_BILL_OF_LADING",
              "GENERAL_AGENCY_AGREEMENT"
            ]
          },
          "returnShipmentDetail": {
            "returnEmailDetail": {
              "merchantPhoneNumber": "19012635656",
              "allowedSpecialService": [
                "SATURDAY_DELIVERY"
              ]
            },
            "rma": {
              "reason": "Wrong Size or Color"
            },
            "returnAssociationDetail": {
              "shipDatestamp": "2019-10-01",
              "trackingNumber": "123456789"
            },
            "returnType": "PRINT_RETURN_LABEL"
          },
          "deliveryOnInvoiceAcceptanceDetail": {
            "recipient": {
              "address": {
                "streetLines": [
                  "23, RUE JOSEPH-DE MA",
                  "Suite 302"
                ],
                "city": "Beverly Hills",
                "stateOrProvinceCode": "CA",
                "postalCode": "90210",
                "countryCode": "US",
                "residential": false
              },
              "contact": {
                "personName": "John Taylor",
                "emailAddress": "sample@company.com",
                "phoneExtension": "000",
                "phoneNumber": "1234567890",
                "companyName": "Fedex"
              },
              "tins": [
                {
                  "number": "123567",
                  "tinType": "FEDERAL",
                  "usage": "usage",
                  "effectiveDate": "2000-01-23T04:56:07.000+00:00",
                  "expirationDate": "2000-01-23T04:56:07.000+00:00"
                }
              ],
              "deliveryInstructions": "Delivery Instructions"
            }
          },
          "internationalTrafficInArmsRegulationsDetail": {
            "licenseOrExemptionNumber": "9871234"
          },
          "pendingShipmentDetail": {
            "pendingShipmentType": "EMAIL",
            "processingOptions": {
              "options": [
                "ALLOW_MODIFICATIONS"
              ]
            },
            "recommendedDocumentSpecification": {
              "types": "ANTIQUE_STATEMENT_EUROPEAN_UNION"
            },
            "emailLabelDetail": {
              "recipients": [
                {
                  "emailAddress": "neena@fedex.com",
                  "optionsRequested": {
                    "options": [
                      "PRODUCE_PAPERLESS_SHIPPING_FORMAT",
                      "SUPPRESS_ACCESS_EMAILS"
                    ]
                  },
                  "role": "SHIPMENT_COMPLETOR",
                  "locale": "en_US"
                }
              ],
              "message": "your optional message"
            },
            "attachedDocuments": [
              {
                "documentType": "PRO_FORMA_INVOICE",
                "documentReference": "DocumentReference",
                "description": "PRO FORMA INVOICE",
                "documentId": "090927d680038c61"
              }
            ],
            "expirationTimeStamp": "2020-01-01"
          },
          "holdAtLocationDetail": {
            "locationId": "YBZA",
            "locationContactAndAddress": {
              "address": {
                "streetLines": [
                  "10 FedEx Parkway",
                  "Suite 302"
                ],
                "city": "Beverly Hills",
                "stateOrProvinceCode": "CA",
                "postalCode": "38127",
                "countryCode": "US",
                "residential": false
              },
              "contact": {
                "personName": "person name",
                "emailAddress": "email address",
                "phoneNumber": "phone number",
                "phoneExtension": "phone extension",
                "companyName": "company name",
                "faxNumber": "fax number"
              }
            },
            "locationType": "FEDEX_ONSITE"
          },
          "shipmentCODDetail": {
            "addTransportationChargesDetail": {
              "rateType": "ACCOUNT",
              "rateLevelType": "BUNDLED_RATE",
              "chargeLevelType": "CURRENT_PACKAGE",
              "chargeType": "COD_SURCHARGE"
            },
            "codRecipient": {
              "address": {
                "streetLines": [
                  "10 FedEx Parkway",
                  "Suite 302"
                ],
                "city": "Beverly Hills",
                "stateOrProvinceCode": "CA",
                "postalCode": "90210",
                "countryCode": "US",
                "residential": false
              },
              "contact": {
                "personName": "John Taylor",
                "emailAddress": "sample@company.com",
                "phoneExtension": "000",
                "phoneNumber": "XXXX345671",
                "companyName": "Fedex"
              },
              "accountNumber": {
                "value": "Your account number"
              },
              "tins": [
                {
                  "number": "123567",
                  "tinType": "FEDERAL",
                  "usage": "usage",
                  "effectiveDate": "2000-01-23T04:56:07.000+00:00",
                  "expirationDate": "2000-01-23T04:56:07.000+00:00"
                }
              ]
            },
            "remitToName": "remitToName",
            "codCollectionType": "ANY",
            "financialInstitutionContactAndAddress": {
              "address": {
                "streetLines": [
                  "10 FedEx Parkway",
                  "Suite 302"
                ],
                "city": "Beverly Hills",
                "stateOrProvinceCode": "CA",
                "postalCode": "38127",
                "countryCode": "US",
                "residential": false
              },
              "contact": {
                "personName": "person name",
                "emailAddress": "email address",
                "phoneNumber": "phone number",
                "phoneExtension": "phone extension",
                "companyName": "company name",
                "faxNumber": "fax number"
              }
            },
            "codCollectionAmount": {
              "amount": 12.45,
              "currency": "USD"
            },
            "returnReferenceIndicatorType": "INVOICE",
            "shipmentCodAmount": {
              "amount": 12.45,
              "currency": "USD"
            }
          },
          "shipmentDryIceDetail": {
            "totalWeight": {
              "units": "LB",
              "value": 10
            },
            "packageCount": 12
          },
          "internationalControlledExportDetail": {
            "licenseOrPermitExpirationDate": "2019-12-03",
            "licenseOrPermitNumber": "11",
            "entryNumber": "125",
            "foreignTradeZoneCode": "US",
            "type": "WAREHOUSE_WITHDRAWAL"
          },
          "homeDeliveryPremiumDetail": {
            "phoneNumber": {
              "areaCode": "901",
              "localNumber": "3575012",
              "extension": "200",
              "personalIdentificationNumber": "98712345"
            },
            "deliveryDate": "2019-06-26",
            "homedeliveryPremiumType": "APPOINTMENT"
          }
        },
        "emailNotificationDetail": {
          "aggregationType": "PER_PACKAGE",
          "emailNotificationRecipients": [
            {
              "name": "Joe Smith",
              "emailNotificationRecipientType": "SHIPPER",
              "emailAddress": "jsmith3@aol.com",
              "notificationFormatType": "TEXT",
              "notificationType": "EMAIL",
              "locale": "en_US",
              "notificationEventType": [
                "ON_PICKUP_DRIVER_ARRIVED",
                "ON_SHIPMENT"
              ]
            }
          ],
          "personalMessage": "your personal message here"
        },
        "expressFreightDetail": {
          "bookingConfirmationNumber": "123456789812",
          "shippersLoadAndCount": 123,
          "packingListEnclosed": true
        },
        "variableHandlingChargeDetail": {
          "rateType": "PREFERRED_CURRENCY",
          "percentValue": 12.45,
          "rateLevelType": "INDIVIDUAL_PACKAGE_RATE",
          "fixedValue": {
            "amount": 24.45,
            "currency": "USD"
          },
          "rateElementBasis": "NET_CHARGE_EXCLUDING_TAXES"
        },
        "customsClearanceDetail": {
          "regulatoryControls": "NOT_IN_FREE_CIRCULATION",
          "brokers": [
            {
              "broker": {
                "address": {
                  "streetLines": [
                    "10 FedEx Parkway",
                    "Suite 302"
                  ],
                  "city": "Beverly Hills",
                  "stateOrProvinceCode": "CA",
                  "postalCode": "90210",
                  "countryCode": "US",
                  "residential": false
                },
                "contact": {
                  "personName": "John Taylor",
                  "emailAddress": "sample@company.com",
                  "phoneNumber": "1234567890",
                  "phoneExtension": 91,
                  "companyName": "Fedex",
                  "faxNumber": 1234567
                },
                "accountNumber": {
                  "value": "Your account number"
                },
                "tins": [
                  {
                    "number": "number",
                    "tinType": "FEDERAL",
                    "usage": "usage",
                    "effectiveDate": "2000-01-23T04:56:07.000+00:00",
                    "expirationDate": "2000-01-23T04:56:07.000+00:00"
                  }
                ],
                "deliveryInstructions": "deliveryInstructions"
              },
              "type": "IMPORT"
            }
          ],
          "commercialInvoice": {
            "originatorName": "originator Name",
            "comments": [
              "optional comments for the commercial invoice"
            ],
            "customerReferences": [
              {
                "customerReferenceType": "INVOICE_NUMBER",
                "value": "3686"
              }
            ],
            "taxesOrMiscellaneousCharge": {
              "amount": 12.45,
              "currency": "USD"
            },
            "taxesOrMiscellaneousChargeType": "COMMISSIONS",
            "freightCharge": {
              "amount": 12.45,
              "currency": "USD"
            },
            "packingCosts": {
              "amount": 12.45,
              "currency": "USD"
            },
            "handlingCosts": {
              "amount": 12.45,
              "currency": "USD"
            },
            "declarationStatement": "declarationStatement",
            "termsOfSale": "FCA",
            "specialInstructions": "specialInstructions\"",
            "shipmentPurpose": "REPAIR_AND_RETURN",
            "emailNotificationDetail": {
              "emailAddress": "neena@fedex.com",
              "type": "EMAILED",
              "recipientType": "SHIPPER"
            }
          },
          "freightOnValue": "OWN_RISK",
          "dutiesPayment": {
            "payor": {
              "responsibleParty": {
                "address": {
                  "streetLines": [
                    "10 FedEx Parkway",
                    "Suite 302"
                  ],
                  "city": "Beverly Hills",
                  "stateOrProvinceCode": "CA",
                  "postalCode": "38127",
                  "countryCode": "US",
                  "residential": false
                },
                "contact": {
                  "personName": "John Taylor",
                  "emailAddress": "sample@company.com",
                  "phoneNumber": "1234567890",
                  "phoneExtension": "phone extension",
                  "companyName": "Fedex",
                  "faxNumber": "fax number"
                },
                "accountNumber": {
                  "value": "Your account number"
                },
                "tins": [
                  {
                    "number": "number",
                    "tinType": "FEDERAL",
                    "usage": "usage",
                    "effectiveDate": "2000-01-23T04:56:07.000+00:00",
                    "expirationDate": "2000-01-23T04:56:07.000+00:00"
                  },
                  {
                    "number": "number",
                    "tinType": "FEDERAL",
                    "usage": "usage",
                    "effectiveDate": "2000-01-23T04:56:07.000+00:00",
                    "expirationDate": "2000-01-23T04:56:07.000+00:00"
                  }
                ]
              }
            },
            "billingDetails": {
              "billingCode": "billingCode",
              "billingType": "billingType",
              "aliasId": "aliasId",
              "accountNickname": "accountNickname",
              "accountNumber": "Your account number",
              "accountNumberCountryCode": "US"
            },
            "paymentType": "SENDER"
          },
          "commodities": [
            {
              "unitPrice": {
                "amount": 12.45,
                "currency": "USD"
              },
              "additionalMeasures": [
                {
                  "quantity": 12.45,
                  "units": "KG"
                }
              ],
              "numberOfPieces": 12,
              "quantity": 125,
              "quantityUnits": "Ea",
              "customsValue": {
                "amount": "1556.25",
                "currency": "USD"
              },
              "countryOfManufacture": "US",
              "cIMarksAndNumbers": "87123",
              "harmonizedCode": "0613",
              "description": "description",
              "name": "non-threaded rivets",
              "weight": {
                "units": "KG",
                "value": 68
              },
              "exportLicenseNumber": "26456",
              "exportLicenseExpirationDate": "2024-04-23T09:30:04Z",
              "partNumber": "167",
              "purpose": "BUSINESS",
              "usmcaDetail": {
                "originCriterion": "A"
              }
            }
          ],
          "isDocumentOnly": true,
          "recipientCustomsId": {
            "type": "PASSPORT",
            "value": "123"
          },
          "customsOption": {
            "description": "Description",
            "type": "COURTESY_RETURN_LABEL"
          },
          "importerOfRecord": {
            "address": {
              "streetLines": [
                "10 FedEx Parkway",
                "Suite 302"
              ],
              "city": "Beverly Hills",
              "stateOrProvinceCode": "CA",
              "postalCode": "90210",
              "countryCode": "US",
              "residential": false
            },
            "contact": {
              "personName": "John Taylor",
              "emailAddress": "sample@company.com",
              "phoneExtension": "000",
              "phoneNumber": "XXXX345671",
              "companyName": "Fedex"
            },
            "accountNumber": {
              "value": "Your account number"
            },
            "tins": [
              {
                "number": "123567",
                "tinType": "FEDERAL",
                "usage": "usage",
                "effectiveDate": "2000-01-23T04:56:07.000+00:00",
                "expirationDate": "2000-01-23T04:56:07.000+00:00"
              }
            ]
          },
          "generatedDocumentLocale": "en_US",
          "exportDetail": {
            "destinationControlDetail": {
              "endUser": "dest country user",
              "statementTypes": "DEPARTMENT_OF_COMMERCE",
              "destinationCountries": [
                "USA",
                "India"
              ]
            },
            "b13AFilingOption": "NOT_REQUIRED",
            "exportComplianceStatement": "12345678901234567",
            "permitNumber": "12345"
          },
          "totalCustomsValue": {
            "amount": 12.45,
            "currency": "USD"
          },
          "partiesToTransactionAreRelated": true,
          "declarationStatementDetail": {
            "usmcaLowValueStatementDetail": {
              "countryOfOriginLowValueDocumentRequested": true,
              "customsRole": "EXPORTER"
            }
          },
          "insuranceCharge": {
            "amount": 12.45,
            "currency": "USD"
          }
        },
        "smartPostInfoDetail": {
          "ancillaryEndorsement": "RETURN_SERVICE",
          "hubId": "5015",
          "indicia": "PRESORTED_STANDARD",
          "specialServices": "USPS_DELIVERY_CONFIRMATION"
        },
        "blockInsightVisibility": true,
        "labelSpecification": {
          "labelFormatType": "COMMON2D",
          "labelOrder": "SHIPPING_LABEL_FIRST",
          "customerSpecifiedDetail": {
            "maskedData": [
              "CUSTOMS_VALUE",
              "TOTAL_WEIGHT"
            ],
            "regulatoryLabels": [
              {
                "generationOptions": "CONTENT_ON_SHIPPING_LABEL_ONLY",
                "type": "ALCOHOL_SHIPMENT_LABEL"
              }
            ],
            "additionalLabels": [
              {
                "type": "CONSIGNEE",
                "count": 1
              }
            ],
            "docTabContent": {
              "docTabContentType": "BARCODED",
              "zone001": {
                "docTabZoneSpecifications": [
                  {
                    "zoneNumber": 0,
                    "header": "string",
                    "dataField": "string",
                    "literalValue": "string",
                    "justification": "RIGHT"
                  }
                ]
              },
              "barcoded": {
                "symbology": "UCC128",
                "specification": {
                  "zoneNumber": 0,
                  "header": "string",
                  "dataField": "string",
                  "literalValue": "string",
                  "justification": "RIGHT"
                }
              }
            }
          },
          "printedLabelOrigin": {
            "address": {
              "streetLines": [
                "10 FedEx Parkway",
                "Suite 302"
              ],
              "city": "Beverly Hills",
              "stateOrProvinceCode": "CA",
              "postalCode": "38127",
              "countryCode": "US",
              "residential": false
            },
            "contact": {
              "personName": "person name",
              "emailAddress": "email address",
              "phoneNumber": "phone number",
              "phoneExtension": "phone extension",
              "companyName": "company name",
              "faxNumber": "fax number"
            }
          },
          "labelStockType": "PAPER_85X11_TOP_HALF_LABEL",
          "labelRotation": "UPSIDE_DOWN",
          "imageType": "PDF",
          "labelPrintingOrientation": "TOP_EDGE_OF_TEXT_FIRST",
          "returnedDispositionDetail": true
        },
        "shippingDocumentSpecification": {
          "generalAgencyAgreementDetail": {
            "documentFormat": {
              "provideInstructions": true,
              "optionsRequested": {
                "options": [
                  "SUPPRESS_ADDITIONAL_LANGUAGES",
                  "SHIPPING_LABEL_LAST"
                ]
              },
              "stockType": "PAPER_LETTER",
              "dispositions": [
                {
                  "eMailDetail": {
                    "eMailRecipients": [
                      {
                        "emailAddress": "email@fedex.com",
                        "recipientType": "THIRD_PARTY"
                      }
                    ],
                    "locale": "en_US",
                    "grouping": "NONE"
                  },
                  "dispositionType": "CONFIRMED"
                }
              ],
              "locale": "en_US",
              "docType": "PDF"
            }
          },
          "returnInstructionsDetail": {
            "customText": "This is additional text printed on Return instr",
            "documentFormat": {
              "provideInstructions": true,
              "optionsRequested": {
                "options": [
                  "SUPPRESS_ADDITIONAL_LANGUAGES",
                  "SHIPPING_LABEL_LAST"
                ]
              },
              "stockType": "PAPER_LETTER",
              "dispositions": [
                {
                  "eMailDetail": {
                    "eMailRecipients": [
                      {
                        "emailAddress": "email@fedex.com",
                        "recipientType": "THIRD_PARTY"
                      }
                    ],
                    "locale": "en_US",
                    "grouping": "NONE"
                  },
                  "dispositionType": "CONFIRMED"
                }
              ],
              "locale": "en_US\"",
              "docType": "PNG"
            }
          },
          "op900Detail": {
            "customerImageUsages": [
              {
                "id": "IMAGE_5",
                "type": "SIGNATURE",
                "providedImageType": "SIGNATURE"
              }
            ],
            "signatureName": "Signature Name",
            "documentFormat": {
              "provideInstructions": true,
              "optionsRequested": {
                "options": [
                  "SUPPRESS_ADDITIONAL_LANGUAGES",
                  "SHIPPING_LABEL_LAST"
                ]
              },
              "stockType": "PAPER_LETTER",
              "dispositions": [
                {
                  "eMailDetail": {
                    "eMailRecipients": [
                      {
                        "emailAddress": "email@fedex.com",
                        "recipientType": "THIRD_PARTY"
                      }
                    ],
                    "locale": "en_US",
                    "grouping": "NONE"
                  },
                  "dispositionType": "CONFIRMED"
                }
              ],
              "locale": "en_US",
              "docType": "PDF"
            }
          },
          "usmcaCertificationOfOriginDetail": {
            "customerImageUsages": [
              {
                "id": "IMAGE_5",
                "type": "SIGNATURE",
                "providedImageType": "SIGNATURE"
              }
            ],
            "documentFormat": {
              "provideInstructions": true,
              "optionsRequested": {
                "options": [
                  "SUPPRESS_ADDITIONAL_LANGUAGES",
                  "SHIPPING_LABEL_LAST"
                ]
              },
              "stockType": "PAPER_LETTER",
              "dispositions": [
                {
                  "eMailDetail": {
                    "eMailRecipients": [
                      {
                        "emailAddress": "email@fedex.com",
                        "recipientType": "THIRD_PARTY"
                      }
                    ],
                    "locale": "en_US",
                    "grouping": "NONE"
                  },
                  "dispositionType": "CONFIRMED"
                }
              ],
              "locale": "en_US",
              "docType": "PDF"
            },
            "certifierSpecification": "EXPORTER",
            "importerSpecification": "UNKNOWN",
            "producerSpecification": "SAME_AS_EXPORTER",
            "producer": {
              "address": {
                "streetLines": [
                  "10 FedEx Parkway",
                  "Suite 302"
                ],
                "city": "Beverly Hills",
                "stateOrProvinceCode": "CA",
                "postalCode": "90210",
                "countryCode": "US",
                "residential": false
              },
              "contact": {
                "personName": "John Taylor",
                "emailAddress": "sample@company.com",
                "phoneExtension": "000",
                "phoneNumber": "XXXX345671",
                "companyName": "Fedex"
              },
              "accountNumber": {
                "value": "Your account number"
              },
              "tins": [
                {
                  "number": "123567",
                  "tinType": "FEDERAL",
                  "usage": "usage",
                  "effectiveDate": "2000-01-23T04:56:07.000+00:00",
                  "expirationDate": "2000-01-23T04:56:07.000+00:00"
                }
              ]
            },
            "blanketPeriod": {
              "begins": "22-01-2020",
              "ends": "2-01-2020"
            },
            "certifierJobTitle": "Manager"
          },
          "usmcaCommercialInvoiceCertificationOfOriginDetail": {
            "customerImageUsages": [
              {
                "id": "IMAGE_5",
                "type": "SIGNATURE",
                "providedImageType": "SIGNATURE"
              }
            ],
            "documentFormat": {
              "provideInstructions": true,
              "optionsRequested": {
                "options": [
                  "SUPPRESS_ADDITIONAL_LANGUAGES",
                  "SHIPPING_LABEL_LAST"
                ]
              },
              "stockType": "PAPER_LETTER",
              "dispositions": [
                {
                  "eMailDetail": {
                    "eMailRecipients": [
                      {
                        "emailAddress": "email@fedex.com",
                        "recipientType": "THIRD_PARTY"
                      }
                    ],
                    "locale": "en_US",
                    "grouping": "NONE"
                  },
                  "dispositionType": "CONFIRMED"
                }
              ],
              "locale": "en_US",
              "docType": "PDF"
            },
            "certifierSpecification": "EXPORTER",
            "importerSpecification": "UNKNOWN",
            "producerSpecification": "SAME_AS_EXPORTER",
            "producer": {
              "address": {
                "streetLines": [
                  "10 FedEx Parkway",
                  "Suite 302"
                ],
                "city": "Beverly Hills",
                "stateOrProvinceCode": "CA",
                "postalCode": "90210",
                "countryCode": "US",
                "residential": false
              },
              "contact": {
                "personName": "John Taylor",
                "emailAddress": "sample@company.com",
                "phoneExtension": "000",
                "phoneNumber": "XXXX345671",
                "companyName": "Fedex"
              },
              "accountNumber": {
                "value": "Your account number"
              },
              "tins": [
                {
                  "number": "123567",
                  "tinType": "FEDERAL",
                  "usage": "usage",
                  "effectiveDate": "2000-01-23T04:56:07.000+00:00",
                  "expirationDate": "2000-01-23T04:56:07.000+00:00"
                }
              ]
            },
            "certifierJobTitle": "Manager"
          },
          "shippingDocumentTypes": [
            "RETURN_INSTRUCTIONS"
          ],
          "certificateOfOrigin": {
            "customerImageUsages": [
              {
                "id": "IMAGE_5",
                "type": "SIGNATURE",
                "providedImageType": "SIGNATURE"
              }
            ],
            "documentFormat": {
              "provideInstructions": true,
              "optionsRequested": {
                "options": [
                  "SUPPRESS_ADDITIONAL_LANGUAGES",
                  "SHIPPING_LABEL_LAST"
                ]
              },
              "stockType": "PAPER_LETTER",
              "dispositions": [
                {
                  "eMailDetail": {
                    "eMailRecipients": [
                      {
                        "emailAddress": "email@fedex.com",
                        "recipientType": "THIRD_PARTY"
                      }
                    ],
                    "locale": "en_US",
                    "grouping": "NONE"
                  },
                  "dispositionType": "CONFIRMED"
                }
              ],
              "locale": "en_US",
              "docType": "PDF"
            }
          },
          "commercialInvoiceDetail": {
            "customerImageUsages": [
              {
                "id": "IMAGE_5",
                "type": "SIGNATURE",
                "providedImageType": "SIGNATURE"
              }
            ],
            "documentFormat": {
              "provideInstructions": true,
              "optionsRequested": {
                "options": [
                  "SUPPRESS_ADDITIONAL_LANGUAGES",
                  "SHIPPING_LABEL_LAST"
                ]
              },
              "stockType": "PAPER_LETTER",
              "dispositions": [
                {
                  "eMailDetail": {
                    "eMailRecipients": [
                      {
                        "emailAddress": "email@fedex.com",
                        "recipientType": "THIRD_PARTY"
                      }
                    ],
                    "locale": "en_US",
                    "grouping": "NONE"
                  },
                  "dispositionType": "CONFIRMED"
                }
              ],
              "locale": "en_US",
              "docType": "PDF"
            }
          }
        },
        "rateRequestType": [
          "LIST",
          "PREFERRED"
        ],
        "preferredCurrency": "USD",
        "totalPackageCount": 25,
        "masterTrackingId": {
          "formId": "0201",
          "trackingIdType": "EXPRESS",
          "uspsApplicationId": "92",
          "trackingNumber": "49092000070120032835"
        },
        "requestedPackageLineItems": [
          {
            "sequenceNumber": "1",
            "subPackagingType": "BUCKET",
            "customerReferences": [
              {
                "customerReferenceType": "INVOICE_NUMBER",
                "value": "3686"
              }
            ],
            "declaredValue": {
              "amount": 12.45,
              "currency": "USD"
            },
            "weight": {
              "units": "KG",
              "value": 68
            },
            "dimensions": {
              "length": 100,
              "width": 50,
              "height": 30,
              "units": "CM"
            },
            "groupPackageCount": 2,
            "itemDescriptionForClearance": "description",
            "contentRecord": [
              {
                "itemNumber": "2876",
                "receivedQuantity": 256,
                "description": "Description",
                "partNumber": "456"
              }
            ],
            "itemDescription": "item description for the package",
            "variableHandlingChargeDetail": {
              "rateType": "PREFERRED_CURRENCY",
              "percentValue": 12.45,
              "rateLevelType": "INDIVIDUAL_PACKAGE_RATE",
              "fixedValue": {
                "amount": 24.45,
                "currency": "USD"
              },
              "rateElementBasis": "NET_CHARGE_EXCLUDING_TAXES"
            },
            "packageSpecialServices": {
              "specialServiceTypes": [
                "ALCOHOL",
                "NON_STANDARD_CONTAINER"
              ],
              "signatureOptionType": "ADULT",
              "priorityAlertDetail": {
                "enhancementTypes": [
                  "PRIORITY_ALERT_PLUS"
                ],
                "content": [
                  "string"
                ]
              },
              "signatureOptionDetail": {
                "signatureReleaseNumber": "23456"
              },
              "alcoholDetail": {
                "alcoholRecipientType": "LICENSEE",
                "shipperAgreementType": "Retailer"
              },
              "dangerousGoodsDetail": {
                "cargoAircraftOnly": false,
                "accessibility": "INACCESSIBLE",
                "options": [
                  "LIMITED_QUANTITIES_COMMODITIES",
                  "ORM_D"
                ]
              },
              "packageCODDetail": {
                "codCollectionAmount": {
                  "amount": 12.45,
                  "currency": "USD"
                }
              },
              "pieceCountVerificationBoxCount": 0,
              "batteryDetails": [
                {
                  "batteryPackingType": "CONTAINED_IN_EQUIPMENT",
                  "batteryRegulatoryType": "IATA_SECTION_II",
                  "batteryMaterialType": "LITHIUM_METAL"
                }
              ],
              "dryIceWeight": {
                "units": "KG",
                "value": 68
              }
            }
          }
        ]
      },
      "accountNumber": {
        "value": "802255209"
      },
    }*/