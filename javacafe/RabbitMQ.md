RabbitMQ : 가장 유명한 메시지 브로커임.

1. 소개
* 우편을 보내는걸로 비유하면 가장 편함
* 우편을 보낼 때, 우편함, 우체국, 우체국 직원의 역할이 RabbitMQ
* 우편물 대신에 RabbitMQ는 binary blob 형태의 데이터로 보냄.
* RabbitMQ는 특별한 용어를 사용함
	 - Producing : sending을 의미, 프로그램에서 메시지를 보낼때, producer라 한다.
	 - Queue : RabbitMQ에서 살아있는 우편 박스를 의미함.
	 
* Queue는 호스트의 메모리와 디스크 리미트로 바운드 됨
* Queue는메세지 버퍼를 위해서 필수
* 많은 Producer들은 하나의 Queue에 메세지를 보낼 수 있음.
* 많은 Consumer들은 하나의 Queue로부터 메세지를 받을 수 있음.
* Consuming : 수신(receiving) 과 비슷한 의미. Consumer들은 메세지를 받기를 기다림.
