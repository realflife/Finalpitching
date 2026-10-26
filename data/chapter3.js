export const chapter3 = {
  "dictionary": [
    {
      "name": "People",
      "thai": "ประชาชน",
      "purpose": "เก็บข้อมูลประชาชน",
      "page": "75",
      "fields": [
        {
          "name": "People_ID",
          "detail": "รหัสประชาชน",
          "type": "VARCHAR",
          "size": "4",
          "key": "PK"
        },
        {
          "name": "People_Name",
          "detail": "ชื่อประชาชน",
          "type": "VARCHAR",
          "size": "30",
          "key": "—"
        },
        {
          "name": "People_Tel",
          "detail": "เบอร์โทรศัพท์",
          "type": "VARCHAR",
          "size": "10",
          "key": "—"
        },
        {
          "name": "People_Address",
          "detail": "ที่อยู่",
          "type": "VARCHAR",
          "size": "20",
          "key": "—"
        }
      ]
    },
    {
      "name": "Staff",
      "thai": "เจ้าหน้าที่",
      "purpose": "เก็บข้อมูลเจ้าหน้าที่",
      "page": "75",
      "fields": [
        {
          "name": "Staff_ID",
          "detail": "รหัสเจ้าหน้าที่",
          "type": "VARCHAR",
          "size": "5",
          "key": "PK"
        },
        {
          "name": "Staff_Name",
          "detail": "ชื่อเจ้าหน้าที่",
          "type": "VARCHAR",
          "size": "30",
          "key": "—"
        },
        {
          "name": "Staff_Tel",
          "detail": "เบอร์โทรศัพท์",
          "type": "VARCHAR",
          "size": "10",
          "key": "—"
        },
        {
          "name": "Staff_Dep",
          "detail": "แผนก",
          "type": "VARCHAR",
          "size": "20",
          "key": "—"
        }
      ]
    },
    {
      "name": "ProblemType",
      "thai": "ประเภทปัญหา",
      "purpose": "เก็บประเภทปัญหา",
      "page": "76",
      "fields": [
        {
          "name": "Prob_ID",
          "detail": "รหัสประเภท",
          "type": "VARCHAR",
          "size": "5",
          "key": "PK"
        },
        {
          "name": "Prob_Name",
          "detail": "ชื่อประเภท",
          "type": "VARCHAR",
          "size": "20",
          "key": "—"
        },
        {
          "name": "Prob_Detail",
          "detail": "รายละเอียดประเภท",
          "type": "VARCHAR",
          "size": "30",
          "key": "—"
        }
      ]
    },
    {
      "name": "Location",
      "thai": "พื้นที่ปัญหา",
      "purpose": "เก็บพื้นที่เกิดปัญหา",
      "page": "76",
      "fields": [
        {
          "name": "Location_ID",
          "detail": "รหัสพื้นที่",
          "type": "VARCHAR",
          "size": "6",
          "key": "PK"
        },
        {
          "name": "Location_Name",
          "detail": "ชื่อพื้นที่",
          "type": "VARCHAR",
          "size": "20",
          "key": "—"
        },
        {
          "name": "Location_Detail",
          "detail": "รายละเอียดพื้นที่",
          "type": "VARCHAR",
          "size": "20",
          "key": "—"
        }
      ]
    },
    {
      "name": "ProblemReporting",
      "thai": "การแจ้งปัญหา",
      "purpose": "เก็บเรื่องร้องเรียนและสถานะ",
      "page": "77",
      "fields": [
        {
          "name": "Report_ID",
          "detail": "รหัสการแจ้ง",
          "type": "VARCHAR",
          "size": "10",
          "key": "PK"
        },
        {
          "name": "People_ID",
          "detail": "รหัสประชาชน",
          "type": "VARCHAR",
          "size": "4",
          "key": "FK"
        },
        {
          "name": "Staff_ID",
          "detail": "รหัสเจ้าหน้าที่",
          "type": "VARCHAR",
          "size": "5",
          "key": "FK"
        },
        {
          "name": "Prob_ID",
          "detail": "รหัสประเภท",
          "type": "VARCHAR",
          "size": "5",
          "key": "FK"
        },
        {
          "name": "Location_ID",
          "detail": "รหัสพื้นที่",
          "type": "VARCHAR",
          "size": "6",
          "key": "FK"
        },
        {
          "name": "Report_Detail",
          "detail": "รายละเอียดปัญหา",
          "type": "VARCHAR",
          "size": "30",
          "key": "—"
        },
        {
          "name": "Report_Date",
          "detail": "วันที่",
          "type": "DATE",
          "size": "—",
          "key": "—"
        },
        {
          "name": "Report_Time",
          "detail": "เวลา",
          "type": "TIME",
          "size": "—",
          "key": "—"
        },
        {
          "name": "Status",
          "detail": "สถานะการดำเนินงาน",
          "type": "ENUM",
          "size": "—",
          "key": "—"
        }
      ],
      "corrections": [
        "แถวรหัสการแจ้ง: ต้นฉบับ Staff_ID → Report_ID ตามคำอธิบายคีย์หลักและ ER",
        "แถวรหัสประชาชน: ต้นฉบับ Staff_Name → People_ID ตามคีย์นอกและ ER",
        "Report_time ในภาพ ER ใช้ Report_Time ให้ตรงตารางพจนานุกรม"
      ]
    }
  ],
  "fishbone": [
    {
      "title": "ข้อจำกัดด้านการสื่อสาร",
      "causes": [
        "ไม่มีช่องทางแจ้งปัญหาที่มีประสิทธิภาพ ประชาชนยังต้องโทรศัพท์หรือเดินทางมาแจ้งด้วยตนเอง",
        "การสื่อสารระหว่างหน่วยงานไม่มีประสิทธิภาพ"
      ]
    },
    {
      "title": "ขาดช่องทางติดตามผล",
      "causes": [
        "ประชาชนไม่มีช่องทางติดตามสถานะการดำเนินงาน",
        "บันทึกผลการดำเนินงานไม่สม่ำเสมอ"
      ]
    },
    {
      "title": "การจัดทำรายงานไม่มีประสิทธิภาพ",
      "causes": [
        "จัดทำรายงานใช้เวลานานและไม่แม่นยำ",
        "เอกสารรายงานชำรุดเสียหาย"
      ]
    },
    {
      "title": "การเข้าถึงข้อมูลไม่มีประสิทธิภาพ",
      "causes": [
        "ค้นหาข้อมูลล่าช้า",
        "จัดเก็บข้อมูลไม่เป็นระบบ"
      ]
    }
  ],
  "entities": [
    {
      "name": "User",
      "group": "บัญชีและโปรไฟล์",
      "base": "People (บัญชี)",
      "source": "django.contrib.auth.models.User (Django 5.2)",
      "uniqueTogether": [],
      "fields": [
        {
          "name": "id",
          "type": "AutoField",
          "pk": true,
          "null": false,
          "unique": false,
          "size": "—",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "username",
          "type": "CharField",
          "pk": false,
          "null": false,
          "unique": true,
          "size": "150",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "password",
          "type": "CharField",
          "pk": false,
          "null": false,
          "unique": false,
          "size": "128",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "first_name",
          "type": "CharField",
          "pk": false,
          "null": false,
          "unique": false,
          "size": "150",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "last_name",
          "type": "CharField",
          "pk": false,
          "null": false,
          "unique": false,
          "size": "150",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "email",
          "type": "EmailField",
          "pk": false,
          "null": false,
          "unique": false,
          "size": "254",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "is_staff",
          "type": "BooleanField",
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "is_superuser",
          "type": "BooleanField",
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "is_active",
          "type": "BooleanField",
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "last_login",
          "type": "DateTimeField",
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "date_joined",
          "type": "DateTimeField",
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "target": null,
          "on_delete": "—"
        }
      ],
      "note": "กลุ่มและสิทธิ์ Django เป็นตาราง framework แยก ไม่รวมใน ER แอพนี้"
    },
    {
      "name": "UserOnboarding",
      "group": "บัญชีและโปรไฟล์",
      "base": null,
      "fields": [
        {
          "name": "id",
          "type": "BigAutoField",
          "pk": true,
          "null": false,
          "unique": true,
          "size": "—",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "user",
          "type": "OneToOneField",
          "target": "User",
          "pk": false,
          "null": false,
          "unique": true,
          "size": "—",
          "on_delete": "models.CASCADE",
          "choices": null,
          "precision": null
        },
        {
          "name": "install_prompt_seen_at",
          "type": "DateTimeField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        }
      ],
      "uniqueTogether": [],
      "source": "models.py + migration snapshot"
    },
    {
      "name": "PeopleProfile",
      "group": "บัญชีและโปรไฟล์",
      "base": "People",
      "fields": [
        {
          "name": "people_id",
          "type": "CharField",
          "target": null,
          "pk": true,
          "null": false,
          "unique": false,
          "size": "10",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "user",
          "type": "OneToOneField",
          "target": "User",
          "pk": false,
          "null": false,
          "unique": true,
          "size": "—",
          "on_delete": "models.CASCADE",
          "choices": null,
          "precision": null
        },
        {
          "name": "tel",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "20",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "address",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "200",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "gender",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "1",
          "on_delete": "—",
          "choices": "[[\"M\", \"ชาย\"], [\"F\", \"หญิง\"], [\"O\", \"อื่นๆ\"]]",
          "precision": null
        },
        {
          "name": "profile_picture",
          "type": "ImageField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        }
      ],
      "uniqueTogether": [],
      "source": "models.py + migration snapshot"
    },
    {
      "name": "StaffProfile",
      "group": "บัญชีและโปรไฟล์",
      "base": "Staff",
      "fields": [
        {
          "name": "id",
          "type": "BigAutoField",
          "pk": true,
          "null": false,
          "unique": true,
          "size": "—",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "user",
          "type": "OneToOneField",
          "target": "User",
          "pk": false,
          "null": false,
          "unique": true,
          "size": "—",
          "on_delete": "models.CASCADE",
          "choices": null,
          "precision": null
        },
        {
          "name": "staff_id",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": true,
          "size": "10",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "tel",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "20",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "department",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "50",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "position",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "50",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "gender",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "1",
          "on_delete": "—",
          "choices": "[[\"M\", \"ชาย\"], [\"F\", \"หญิง\"], [\"O\", \"อื่นๆ\"]]",
          "precision": null
        },
        {
          "name": "profile_picture",
          "type": "ImageField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "current_latitude",
          "type": "DecimalField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": "9/6"
        },
        {
          "name": "current_longitude",
          "type": "DecimalField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": "9/6"
        },
        {
          "name": "last_location_update",
          "type": "DateTimeField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "is_available",
          "type": "BooleanField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        }
      ],
      "uniqueTogether": [],
      "source": "models.py + migration snapshot"
    },
    {
      "name": "PreApprovedStaff",
      "group": "ข้อมูลสนับสนุน",
      "base": null,
      "fields": [
        {
          "name": "id",
          "type": "BigAutoField",
          "pk": true,
          "null": false,
          "unique": true,
          "size": "—",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "staff_id",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": true,
          "size": "10",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "first_name",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "50",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "last_name",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "50",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "department",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "50",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "position",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "50",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "tel",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "20",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "problem_type_code",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "10",
          "on_delete": "—",
          "choices": null,
          "precision": null
        }
      ],
      "uniqueTogether": [],
      "source": "models.py + migration snapshot"
    },
    {
      "name": "Tambon",
      "group": "เรื่องและพื้นที่",
      "base": "Location",
      "fields": [
        {
          "name": "id",
          "type": "BigAutoField",
          "pk": true,
          "null": false,
          "unique": true,
          "size": "—",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "tambon_code",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": true,
          "size": "6",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "name",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "100",
          "on_delete": "—",
          "choices": null,
          "precision": null
        }
      ],
      "uniqueTogether": [],
      "source": "models.py + migration snapshot"
    },
    {
      "name": "Village",
      "group": "เรื่องและพื้นที่",
      "base": "Location",
      "fields": [
        {
          "name": "id",
          "type": "BigAutoField",
          "pk": true,
          "null": false,
          "unique": true,
          "size": "—",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "tambon",
          "type": "ForeignKey",
          "target": "Tambon",
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "models.PROTECT",
          "choices": null,
          "precision": null
        },
        {
          "name": "village_code",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": true,
          "size": "10",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "moo",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "3",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "name",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "100",
          "on_delete": "—",
          "choices": null,
          "precision": null
        }
      ],
      "uniqueTogether": [
        [
          "tambon",
          "moo"
        ]
      ],
      "source": "models.py + migration snapshot"
    },
    {
      "name": "ProblemType",
      "group": "เรื่องและพื้นที่",
      "base": "ProblemType",
      "fields": [
        {
          "name": "type_code",
          "type": "CharField",
          "target": null,
          "pk": true,
          "null": false,
          "unique": false,
          "size": "5",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "name",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "100",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "detail",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "200",
          "on_delete": "—",
          "choices": null,
          "precision": null
        }
      ],
      "uniqueTogether": [],
      "source": "models.py + migration snapshot"
    },
    {
      "name": "Report",
      "group": "เรื่องและพื้นที่",
      "base": "ProblemReporting",
      "fields": [
        {
          "name": "id",
          "type": "BigAutoField",
          "pk": true,
          "null": false,
          "unique": true,
          "size": "—",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "report_code",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": true,
          "size": "20",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "reporter",
          "type": "ForeignKey",
          "target": "User",
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "models.SET_NULL",
          "choices": null,
          "precision": null
        },
        {
          "name": "problem_type",
          "type": "ForeignKey",
          "target": "ProblemType",
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "models.SET_NULL",
          "choices": null,
          "precision": null
        },
        {
          "name": "title",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "200",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "description",
          "type": "TextField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "severity_level",
          "type": "IntegerField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": "[[1, \"ปกติ (Normal)\"], [2, \"ปานกลาง (Medium)\"], [3, \"เร่งด่วน (Urgent)\"], [4, \"วิกฤต/นาทีชีวิต (Critical)\"]]",
          "precision": null
        },
        {
          "name": "is_life_threatening",
          "type": "BooleanField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "latitude",
          "type": "DecimalField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": "9/6"
        },
        {
          "name": "longitude",
          "type": "DecimalField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": "9/6"
        },
        {
          "name": "village",
          "type": "ForeignKey",
          "target": "Village",
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "models.SET_NULL",
          "choices": null,
          "precision": null
        },
        {
          "name": "location_detail",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "200",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "image",
          "type": "ImageField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "resolved_image",
          "type": "ImageField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "resolved_detail",
          "type": "TextField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "assigned_staff",
          "type": "ForeignKey",
          "target": "StaffProfile",
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "models.SET_NULL",
          "choices": null,
          "precision": null
        },
        {
          "name": "status",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "20",
          "on_delete": "—",
          "choices": "[[\"pending\", \"รอรับเรื่อง\"], [\"accepted\", \"รับเรื่องแล้ว\"], [\"in_progress\", \"กำลังดำเนินการ\"], [\"pending_verification\", \"รอตรวจสอบ\"], [\"completed\", \"เสร็จสิ้น\"]]",
          "precision": null
        },
        {
          "name": "created_at",
          "type": "DateTimeField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "updated_at",
          "type": "DateTimeField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        }
      ],
      "uniqueTogether": [],
      "source": "models.py + migration snapshot"
    },
    {
      "name": "ReportJourney",
      "group": "การเดินทาง",
      "base": null,
      "fields": [
        {
          "name": "id",
          "type": "BigAutoField",
          "pk": true,
          "null": false,
          "unique": true,
          "size": "—",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "report",
          "type": "OneToOneField",
          "target": "Report",
          "pk": false,
          "null": false,
          "unique": true,
          "size": "—",
          "on_delete": "models.CASCADE",
          "choices": null,
          "precision": null
        },
        {
          "name": "staff",
          "type": "ForeignKey",
          "target": "StaffProfile",
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "models.CASCADE",
          "choices": null,
          "precision": null
        },
        {
          "name": "active_staff",
          "type": "OneToOneField",
          "target": "StaffProfile",
          "pk": false,
          "null": true,
          "unique": true,
          "size": "—",
          "on_delete": "models.SET_NULL",
          "choices": null,
          "precision": null
        },
        {
          "name": "version",
          "type": "UUIDField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "state",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "16",
          "on_delete": "—",
          "choices": "[('ready', 'พร้อมเดินทาง'), ('travelling', 'กำลังเดินทาง'), ('arrived', 'ถึงหน้างาน'), ('stopped', 'หยุดเดินทาง')]",
          "precision": null
        },
        {
          "name": "destination",
          "type": "JSONField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "route",
          "type": "JSONField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "route_updated_at",
          "type": "DateTimeField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "route_attempted_at",
          "type": "DateTimeField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "route_error",
          "type": "BooleanField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "started_at",
          "type": "DateTimeField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "ended_at",
          "type": "DateTimeField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "latitude",
          "type": "FloatField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "longitude",
          "type": "FloatField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "accuracy",
          "type": "FloatField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "location_updated_at",
          "type": "DateTimeField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "position_timestamp",
          "type": "FloatField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "remaining_distance",
          "type": "FloatField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "remaining_duration",
          "type": "FloatField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "writer_token",
          "type": "UUIDField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "writer_expires_at",
          "type": "DateTimeField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        }
      ],
      "uniqueTogether": [],
      "source": "models.py + migration snapshot"
    },
    {
      "name": "RouteDailyBudget",
      "group": "ข้อมูลสนับสนุน",
      "base": null,
      "fields": [
        {
          "name": "day",
          "type": "DateField",
          "target": null,
          "pk": true,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "requests",
          "type": "PositiveIntegerField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        }
      ],
      "uniqueTogether": [],
      "source": "models.py + migration snapshot"
    },
    {
      "name": "Notification",
      "group": "การแจ้งเตือน / Push",
      "base": null,
      "fields": [
        {
          "name": "id",
          "type": "BigAutoField",
          "pk": true,
          "null": false,
          "unique": true,
          "size": "—",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "user",
          "type": "ForeignKey",
          "target": "User",
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "models.CASCADE",
          "choices": null,
          "precision": null
        },
        {
          "name": "report",
          "type": "ForeignKey",
          "target": "Report",
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "models.CASCADE",
          "choices": null,
          "precision": null
        },
        {
          "name": "title",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "255",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "message",
          "type": "TextField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "target_url",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "255",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "is_read",
          "type": "BooleanField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "created_at",
          "type": "DateTimeField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        }
      ],
      "uniqueTogether": [],
      "source": "models.py + migration snapshot"
    },
    {
      "name": "PushSubscription",
      "group": "การแจ้งเตือน / Push",
      "base": null,
      "fields": [
        {
          "name": "id",
          "type": "BigAutoField",
          "pk": true,
          "null": false,
          "unique": true,
          "size": "—",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "user",
          "type": "ForeignKey",
          "target": "User",
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "models.CASCADE",
          "choices": null,
          "precision": null
        },
        {
          "name": "endpoint",
          "type": "URLField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": true,
          "size": "500",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "p256dh",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "200",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "auth",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "200",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "created_at",
          "type": "DateTimeField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        }
      ],
      "uniqueTogether": [],
      "source": "models.py + migration snapshot"
    },
    {
      "name": "ChatConversation",
      "group": "แชต",
      "base": null,
      "fields": [
        {
          "name": "id",
          "type": "BigAutoField",
          "pk": true,
          "null": false,
          "unique": true,
          "size": "—",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "user",
          "type": "ForeignKey",
          "target": "User",
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "models.CASCADE",
          "choices": null,
          "precision": null
        },
        {
          "name": "created_at",
          "type": "DateTimeField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        }
      ],
      "uniqueTogether": [],
      "source": "models.py + migration snapshot"
    },
    {
      "name": "ChatMessage",
      "group": "แชต",
      "base": null,
      "fields": [
        {
          "name": "id",
          "type": "BigAutoField",
          "pk": true,
          "null": false,
          "unique": true,
          "size": "—",
          "target": null,
          "on_delete": "—"
        },
        {
          "name": "conversation",
          "type": "ForeignKey",
          "target": "ChatConversation",
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "models.CASCADE",
          "choices": null,
          "precision": null
        },
        {
          "name": "role",
          "type": "CharField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "20",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "content",
          "type": "TextField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "tool_calls_log",
          "type": "JSONField",
          "target": null,
          "pk": false,
          "null": true,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        },
        {
          "name": "created_at",
          "type": "DateTimeField",
          "target": null,
          "pk": false,
          "null": false,
          "unique": false,
          "size": "—",
          "on_delete": "—",
          "choices": null,
          "precision": null
        }
      ],
      "uniqueTogether": [],
      "source": "models.py + migration snapshot"
    }
  ],
  "processes": [
    {
      "id": "1",
      "title": "เตรียมข้อมูล",
      "actor": "เจ้าหน้าที่",
      "input": "ข้อมูลหลักและข้อมูลการแจ้ง",
      "output": "ข้อมูลที่เพิ่ม แก้ไข หรือลบ",
      "stores": [
        "D1 เจ้าหน้าที่",
        "D2 ประเภทปัญหา",
        "D3 ประชาชน",
        "D4 การแจ้งปัญหา",
        "D5 พื้นที่ปัญหา"
      ],
      "sub": [
        "1.1 เพิ่มข้อมูล",
        "1.2 แก้ไขข้อมูล",
        "1.3 ลบข้อมูล"
      ],
      "note": "ภาพ 3-6 และคำอธิบายหน้า 66 ใช้ เพิ่ม/แก้ไข/ลบ ต่างจากรายการภาพ 3-2 ที่เขียน ค้นหา/เพิ่ม/ลบ",
      "page": "65–66"
    },
    {
      "id": "2",
      "title": "แจ้งปัญหา",
      "actor": "ประชาชน",
      "input": "ข้อมูลประชาชนและข้อมูลการแจ้ง",
      "output": "ข้อมูลเรื่องร้องเรียน",
      "stores": [
        "D3 ประชาชน",
        "D4 การแจ้งปัญหา"
      ],
      "sub": [
        "2.1 รับเรื่องร้องเรียน",
        "2.2 บันทึกข้อมูลการร้องเรียน",
        "2.3 ค้นหาข้อมูลเรื่องร้องเรียน"
      ],
      "page": "67–68"
    },
    {
      "id": "3",
      "title": "บันทึกผลการแก้ไข",
      "actor": "เจ้าหน้าที่",
      "input": "ผลการแก้ไขและข้อมูลอ้างอิง",
      "output": "ผลการดำเนินงานในเรื่องร้องเรียน",
      "stores": [
        "D1 เจ้าหน้าที่",
        "D2 ประเภทปัญหา",
        "D4 การแจ้งปัญหา",
        "D5 พื้นที่ปัญหา"
      ],
      "sub": [
        "3.1 รับข้อมูลผลการแก้ไข",
        "3.2 บันทึกข้อมูลผลการแก้ไข"
      ],
      "page": "69–70"
    },
    {
      "id": "4",
      "title": "พิมพ์รายงาน",
      "actor": "เทศบาล / ผู้รับรายงาน",
      "input": "เงื่อนไขและข้อมูลสำหรับรายงาน",
      "output": "รายงานข้อมูลและสถิติ",
      "stores": [
        "D1 เจ้าหน้าที่",
        "D2 ประเภทปัญหา",
        "D3 ประชาชน",
        "D4 การแจ้งปัญหา",
        "D5 พื้นที่ปัญหา"
      ],
      "sub": [
        "4.1 เลือกเงื่อนไขรายงาน",
        "4.2 ประมวลผลข้อมูล",
        "4.3 พิมพ์รายงาน"
      ],
      "page": "71–72",
      "note": "Context แสดงเทศบาลเป็นผู้รับรายงาน การเลือกเงื่อนไขมาจากรายละเอียด Level 2"
    }
  ],
  "reports": [
    "รายงานสถิติการแจ้งประจำปี",
    "รายงานสถิติการแจ้งประจำเดือน",
    "รายงานสถิติการแจ้งประจำวัน",
    "รายงานการแจ้งปัญหาประจำเดือน",
    "รายงานการแจ้งปัญหาประจำวัน",
    "รายงานข้อมูลประชาชน",
    "รายงานข้อมูลเจ้าหน้าที่",
    "รายงานข้อมูลพื้นที่ปัญหา",
    "รายงานสถานะการดำเนินงาน",
    "รายงานข้อมูลประเภทปัญหา"
  ],
  "source": {
    "pdf": "บทที่ 3 new.pdf",
    "date": "2026-10-08",
    "migrations": [
      "0001_initial.py",
      "0002_report_assigned_staff.py",
      "0003_report_image.py",
      "0004_peopleprofile_gender_peopleprofile_profile_picture_and_more.py",
      "0005_alter_peopleprofile_gender_alter_staffprofile_gender.py",
      "0006_preapprovedstaff.py",
      "0007_alter_peopleprofile_tel_alter_staffprofile_tel.py",
      "0008_staffprofile_position.py",
      "0009_remove_report_problem_type.py",
      "0010_remove_problemtype_id_alter_problemtype_type_code.py",
      "0011_report_problem_type.py",
      "0012_alter_report_reporter_alter_village_tambon.py",
      "0013_alter_report_status.py",
      "0014_alter_report_status.py",
      "0015_remove_peopleprofile_id_peopleprofile_people_id.py",
      "0016_report_resolved_detail_report_resolved_image.py",
      "0017_report_latitude_report_longitude.py",
      "0018_notification.py",
      "0019_chatconversation_chatmessage.py",
      "0020_pushsubscription.py",
      "0021_report_is_life_threatening_report_severity_level.py",
      "0022_staffprofile_current_latitude_and_more.py",
      "0023_report_journey.py",
      "0024_journey_route_throttle.py",
      "0025_journey_route_error.py",
      "0026_useronboarding.py"
    ]
  }
};
