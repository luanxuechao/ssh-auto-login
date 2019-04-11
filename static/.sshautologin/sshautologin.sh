#!/usr/bin/expect
set sshHost ""
set password ""
set port  22
set secretPath ""
set timeout 3
if { "$secretPath" =="" } {
   spawn ssh $sshHost -p $port
    expect {
    "*yes/no*" { send "yes\r"; exp_continue}
    "*password*:" { send "$password\r" }
    }
    interact
} else {
    spawn ssh $sshHost -i $secretPath
}                    
