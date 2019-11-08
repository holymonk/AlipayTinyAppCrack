import frida
import sys

# script = 'verify_name.js'
script = 'tinyapp.js'

with open('scripts/' + script) as fp:
    jscode = ''.join(fp)


def on_message(msg, data):
    print(msg)


# pid = frida.get_usb_device().spawn('com.eg.android.AlipayGphone')
# process = frida.get_usb_device().attach(pid)
# frida.get_usb_device().resume(pid)

process = frida.get_usb_device().attach('com.eg.android.AlipayGphone:lite1')

script = process.create_script(jscode)
script.on('message', on_message)
print('Connected')
script.load()
sys.stdin.read()
process.detach()
