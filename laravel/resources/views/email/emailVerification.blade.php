
<table width="600" align="center">
    <tr>
        <td style="background: #eee; padding: 20px">
            <div style="position: relative;">
                <img style="height: 35px;" src="{{env('ORDERKUB_URL', 'https://www.orderkub.com')}}/images/logo.png" >
            </div>
        </td>
    </tr>
    <tr>
        <td style="padding: 20px">
            <b style="font-size: medium;">ยืนยันการสมัครสมาชิก เว็บไซต์ Orderkub</b>
            <br/>
            <br/>
            <a style="color: #88d5bd;" href="{{env('ORDERKUB_URL', 'https://www.orderkub.com')}}/verify-email-register?token={{$token}}">คลิกที่นี่เพื่อยืนยันการสมัครสมาชิก</a>
            <br/>
            <br/>
            <br/>
            <br/>
        </td>
    </tr>
    <tr>
        <td style="background: #eee; padding: 20px; text-align: center;">
            © 2000-2023, All Rights Reserved
        </td>
    </tr>
  </table>