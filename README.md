아두이노를 이용한 스마트플러그(서버)
=================================
Use Node.js
-----------
* * *
# 기능
## express로 WAS 구현 및 DB 연결
GET, POST등의 메소드를 이용하여 페이지에서 값을 전달받아
DB로 처리.
## TCP/IP로 아두이노와 통신
아두이노는 특정 시간마다 자신의 상태를 프로토콜에 맞춰 서버로 전송함. 해당하는 플래그에 맞는 동작*(전달받은 플러그값 DB적재나 삭제)* 실행
> 통신 프로토콜(문자열) (FLAG|MAC|IP|PORT|PLUG1|PLUG2|PLUG3|PERMISSION)
*FLAG(0:create 1:update 2:delete)*
## LEA를 이용해 통신 패킷 암호화
아두이노와 LEA를 이용하여 패킷을 암호화 및 복호화하여 통신함
~~**KEY값은 임시로 설정**~~(특정 알고리즘을 이용하여 KEY생성)

>*LEA가 Node.js단에서 작동이 불가하여 자식프로세스를 생성 후 암호화 및 복호화 작업을 진행함
* * *
# 실행
![plug1](https://t1.daumcdn.net/cfile/tistory/991E6B475BED0E1029)

1. **콘센트모습(릴레이연결)**

![plug2](https://t1.daumcdn.net/cfile/tistory/99943E475BED0E1230)

2. **아두이노 회로도**

![plug3](https://t1.daumcdn.net/cfile/tistory/99BFA6475BED0E1215)

3. **더미클라를 이용한 서버 테스트**

![plug4](https://t1.daumcdn.net/cfile/tistory/995D9B475BED0E131A)

4. **플러그 이름 변경(권한 있을 시)**

![plug5](https://t1.daumcdn.net/cfile/tistory/99FA1F475BED0E141E)

5. **플러그 상태 값 변경(권한 있을 시)**

![plug6](https://t1.daumcdn.net/cfile/tistory/995DC0475BED0E151A)

6. **플러그 상태 값 변경(권한 없을 시)**
>임의로 관리자페이지 레벨에서 권한값을 1로 설정해서 보내도 DB와 대조 후 권한이 없으면 Deny시킴
