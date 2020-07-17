import Core from './core';
import Events from './events';
import {Status} from './status';

Core.Events = Events;
Core.Status = Status;
Core.UploadCore = Core;
Core.VERSION = '2.3.1';
Core.Core = Core;

export default Core;